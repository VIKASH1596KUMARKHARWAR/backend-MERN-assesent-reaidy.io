const openrouter = require("./openrouter.client");
const TaskRepository = require("../../repositories/task.repository");
const ProjectMemberRepository = require("../../repositories/projectMember.repository");
const TaskAiHistory = require("../../models/taskAiHistory.model");
const NotificationService = require("../notification.service");


class TaskAiService {
    constructor() {
        this.taskRepo = new TaskRepository();
        this.memberRepo = new ProjectMemberRepository();
        this.notificationService = new NotificationService
    }

    async suggest(taskId) {
        // 1️⃣ Fetch task
        const task = await this.taskRepo.getById(taskId);
        if (!task) throw new Error("Task not found");

        // 2️⃣ Fetch accepted members
        const members = await this.memberRepo.getProjectMembers(task.projectId);
        if (!members || members.length === 0) {
            throw new Error("No project members found");
        }

        // 3️⃣ Build context
        const context = {
            task: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
            },
            members: members.map(m => ({
                userId: m.userId._id.toString(),
                role: m.role,
            })),
        };

        // 4️⃣ AI call (STRICT rules)
        const response = await openrouter.chat.send({
            chatGenerationParams: {
                model: "openrouter/free",
                temperature: 0.2,
                messages: [
                    {
                        role: "system",
                        content: `
Return ONLY valid JSON. No markdown. No explanation.

Rules:
- You MUST recommend an assignee if members exist.
- Prefer MANAGER over OWNER.
- Prefer MEMBER if task status is TODO or IN_PROGRESS.
- assignedTo must NEVER be null.

Schema:
{
  "priority": "LOW | MEDIUM | HIGH",
  "assignedTo": "userId",
  "dueDate": "YYYY-MM-DD | null",
  "reasoning": {
    "priority": "string",
    "assignee": "string",
    "deadline": "string"
  }
}
                        `.trim(),
                    },
                    {
                        role: "user",
                        content: JSON.stringify(context),
                    },
                ],
            },
        });

        // 5️⃣ Parse AI output
let raw;

try {
    const content = response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("AI returned empty response");
    }

    raw = JSON.parse(content);
} catch (err) {
    console.error("AI JSON parse failed:", err.message);

    // 🔒 SAFE FALLBACK
    const fallback =
        members.find(m => m.role === "MANAGER") ||
        members.find(m => m.role === "MEMBER") ||
        members.find(m => m.role === "OWNER");

    raw = {
        priority: task.priority,
        assignedTo: fallback.userId._id.toString(),
        dueDate: task.dueDate,
        reasoning: {
            priority: "Fallback used due to AI parse error",
            assignee: "Fallback assignment",
            deadline: "Fallback deadline",
        },
    };
}


        // 6️⃣ Normalize + BACKEND GUARANTEE 🔒
        let assignedTo = raw.assignedTo ?? null;

        if (!assignedTo) {
            const fallback =
                members.find(m => m.role === "MANAGER") ||
                members.find(m => m.role === "MEMBER") ||
                members.find(m => m.role === "OWNER");

            assignedTo = fallback.userId._id.toString();
            raw.reasoning.assignee += " (backend fallback applied)";
        }

        const normalizedSuggestion = {
            priority: raw.priority ?? task.priority,
            assignedTo,
            dueDate: raw.dueDate ? new Date(raw.dueDate) : task.dueDate,
            reasoning: {
                priority: raw.reasoning?.priority ?? "",
                assignee: raw.reasoning?.assignee ?? "",
                deadline: raw.reasoning?.deadline ?? "",
            },
        };

        await this.taskRepo.update(taskId, {
            aiSuggestion: normalizedSuggestion,
            aiSuggestedAt: new Date(),
        });

        // 🔔 notify project OWNER / MANAGERS
        const ownersAndManagers = members.filter(m =>
            ["OWNER", "MANAGER"].includes(m.role)
        );

        for (const m of ownersAndManagers) {
            await this.notificationService.notifyAiSuggested({
                userId: m.userId._id,
                projectId: task.projectId,
                taskId,
                taskTitle: task.title,
            });
        }


        await TaskAiHistory.create({
            taskId,
            suggestion: normalizedSuggestion,
        });

    }
}

module.exports = TaskAiService;
