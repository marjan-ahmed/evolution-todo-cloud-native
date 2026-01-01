"""
Interactive CLI Todo Application
Built with Textual framework for beautiful, interactive terminal UI
Spec-compliant in-memory implementation with all features
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional

import pyfiglet
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Grid, Horizontal
from textual.screen import ModalScreen
from textual.widgets import (
    Button,
    DataTable,
    Footer,
    Header,
    Input,
    Select,
    Static,
)


# ============================================================================
# Data Models (Business Logic - Decoupled from UI)
# ============================================================================

class Priority(Enum):
    """Task priority levels"""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class Recurrence(Enum):
    """Task recurrence patterns"""
    NONE = "None"
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"


@dataclass
class Task:
    """Represents a single todo task"""
    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)
    priority: Priority = Priority.MEDIUM
    category: str = None
    due_date: datetime = None
    recurrence: Recurrence = Recurrence.NONE
    completed_at: datetime = None

    def __str__(self) -> str:
        status = "[x]" if self.completed else "[ ]"
        return f"{status} {self.title}"


class TaskManager:
    """Manages todo tasks with in-memory storage only"""

    def __init__(self):
        self.tasks: List[Task] = []
        self.next_id = 1

    def add_task(
        self,
        title: str,
        description: str = "",
        priority: Priority = Priority.MEDIUM,
        category: str = None,
        due_date: datetime = None,
        recurrence: Recurrence = Recurrence.NONE
    ) -> Task:
        """Add a new task"""
        title = title.strip()
        description = description.strip()

        if not title:
            raise ValueError("Title cannot be empty")

        task = Task(
            id=self.next_id,
            title=title,
            description=description,
            priority=priority,
            category=category,
            due_date=due_date,
            recurrence=recurrence
        )
        self.tasks.append(task)
        self.next_id += 1
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Get task by ID"""
        return next((t for t in self.tasks if t.id == task_id), None)

    def update_task(
        self,
        task_id: int,
        title: str = None,
        description: str = None,
        priority: Priority = None,
        category: str = None,
        due_date: datetime = None,
        recurrence: Recurrence = None
    ) -> bool:
        """Update task fields"""
        task = self.get_task(task_id)
        if not task:
            return False

        if title is not None:
            title = title.strip()
            if not title:
                raise ValueError("Title cannot be empty")
            task.title = title

        if description is not None:
            task.description = description.strip()

        if priority is not None:
            task.priority = priority

        if category is not None:
            task.category = category

        if due_date is not None:
            task.due_date = due_date

        if recurrence is not None:
            task.recurrence = recurrence

        return True

    def delete_task(self, task_id: int) -> bool:
        """Delete a task"""
        task = self.get_task(task_id)
        if task:
            self.tasks.remove(task)
            return True
        return False

    def toggle_task(self, task_id: int) -> Optional[Task]:
        """Toggle task completion status, create next instance for recurring tasks"""
        task = self.get_task(task_id)
        if not task:
            return None

        # Mark as complete or incomplete
        if not task.completed:
            task.completed = True
            task.completed_at = datetime.now()

            # Handle recurrence: create next instance
            if task.recurrence != Recurrence.NONE and task.due_date:
                next_due_date = self._calculate_next_due_date(task.due_date, task.recurrence)
                new_task = Task(
                    id=self.next_id,
                    title=task.title,
                    description=task.description,
                    priority=task.priority,
                    category=task.category,
                    due_date=next_due_date,
                    recurrence=task.recurrence
                )
                self.tasks.append(new_task)
                self.next_id += 1
                return new_task  # Return new recurring task
        else:
            # Reopen task - clear completed timestamp
            task.completed = False
            task.completed_at = None

        return task

    def get_stats(self) -> dict:
        """Calculate task statistics"""
        total = len(self.tasks)
        completed = sum(1 for t in self.tasks if t.completed)
        pending = total - completed
        percentage = (completed / total * 100) if total > 0 else 0.0

        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "percentage": percentage
        }

    def search_tasks(self, keyword: str) -> List[Task]:
        """Find tasks matching keyword in title or description"""
        if not keyword:
            return self.tasks.copy()

        keyword_lower = keyword.lower()
        return [
            t for t in self.tasks
            if keyword_lower in t.title.lower() or keyword_lower in t.description.lower()
        ]

    def filter_tasks(
        self,
        status: bool = None,
        priority: Priority = None,
        category: str = None,
        due_date_filter: str = None
    ) -> List[Task]:
        """Filter tasks by multiple criteria using AND logic"""
        filtered_tasks = self.tasks.copy()

        if status is not None:
            filtered_tasks = [t for t in filtered_tasks if t.completed == status]

        if priority is not None:
            filtered_tasks = [t for t in filtered_tasks if t.priority == priority]

        if category is not None:
            filtered_tasks = [t for t in filtered_tasks if t.category == category]

        if due_date_filter == "due_today":
            today = datetime.now().date()
            filtered_tasks = [t for t in filtered_tasks if t.due_date and t.due_date.date() == today]
        elif due_date_filter == "upcoming":
            now = datetime.now()
            one_week = now + timedelta(days=7)
            filtered_tasks = [t for t in filtered_tasks if t.due_date and now <= t.due_date <= one_week]
        elif due_date_filter == "overdue":
            now = datetime.now()
            filtered_tasks = [t for t in filtered_tasks if t.due_date and t.due_date < now and not t.completed]

        return filtered_tasks

    def sort_tasks(self, tasks: List[Task] = None, by: str = "created_at") -> List[Task]:
        """Sort tasks by specified criteria"""
        if tasks is None:
            tasks = self.tasks.copy()

        if by == "priority":
            priority_order = {Priority.HIGH: 0, Priority.MEDIUM: 1, Priority.LOW: 2}
            return sorted(tasks, key=lambda t: (priority_order.get(t.priority, 99), -t.id))
        elif by == "due_date":
            return sorted(tasks, key=lambda t: (t.due_date or datetime.max, t.created_at))
        elif by == "title":
            return sorted(tasks, key=lambda t: t.title.lower())
        elif by == "created_at":
            return sorted(tasks, key=lambda t: t.created_at, reverse=True)
        else:
            return tasks

    def get_overdue_and_upcoming(self) -> dict:
        """Calculate tasks due soon or overdue"""
        now = datetime.now()
        one_day = now + timedelta(days=1)

        overdue = [t for t in self.tasks if t.due_date and t.due_date < now and not t.completed]
        upcoming = [t for t in self.tasks if t.due_date and now <= t.due_date <= one_day and not t.completed]

        return {
            "overdue": overdue,
            "upcoming": upcoming,
            "count": len(overdue) + len(upcoming)
        }

    def _calculate_next_due_date(self, due_date: datetime, recurrence: Recurrence) -> datetime:
        """Calculate next due date based on recurrence pattern"""
        if recurrence == Recurrence.DAILY:
            return due_date + timedelta(days=1)
        elif recurrence == Recurrence.WEEKLY:
            return due_date + timedelta(weeks=1)
        elif recurrence == Recurrence.MONTHLY:
            # Add one month (handles year rollover)
            year = due_date.year + ((due_date.month + 1 - 1) // 12)
            month = (due_date.month + 1 - 1) % 12 + 1
            day = min(due_date.day, [31, 29 if year % 4 == 0 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
            return due_date.replace(year=year, month=month, day=day)
        return due_date


# ============================================================================
# UI Components (Screens and Modals)
# ============================================================================

class AddTaskScreen(ModalScreen[dict]):
    """Modal screen for adding a new task"""

    CSS = """
    AddTaskScreen {
        align: center middle;
    }

    #dialog {
        width: 60;
        height: auto;
        border: solid $primary;
        background: $surface;
        padding: 2;
    }

    .dialog-title {
        text-align: center;
        text-style: bold;
        color: $primary;
        padding-bottom: 1;
    }

    Input, Select {
        margin: 1 0;
    }

    Horizontal {
        align: center middle;
        height: auto;
    }

    Button {
        margin: 0 1;
    }
    """

    BINDINGS = [
        Binding("escape", "cancel", "Cancel"),
    ]

    def compose(self) -> ComposeResult:
        with Container(id="dialog"):
            yield Static("✨ Add New Task", classes="dialog-title")
            yield Input(placeholder="Task title (required)", id="title")
            yield Input(placeholder="Description (optional)", id="description")
            yield Input(placeholder="Due date (YYYY-MM-DD format, e.g. 2026-01-20, optional)", id="due_date")
            yield Select(
                options=[
                    ("High Priority", Priority.HIGH),
                    ("Medium Priority", Priority.MEDIUM),
                    ("Low Priority", Priority.LOW),
                ],
                value=Priority.MEDIUM,
                id="priority"
            )
            yield Input(placeholder="Category (optional)", id="category")
            yield Select(
                options=[
                    ("None", Recurrence.NONE),
                    ("Daily", Recurrence.DAILY),
                    ("Weekly", Recurrence.WEEKLY),
                    ("Monthly", Recurrence.MONTHLY),
                ],
                value=Recurrence.NONE,
                id="recurrence"
            )
            yield Horizontal(
                Button("Add", variant="success", id="add"),
                Button("Cancel", variant="default", id="cancel")
            )

    def on_mount(self) -> None:
        self.query_one("#title", Input).focus()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "add":
            title = self.query_one("#title", Input).value.strip()
            description = self.query_one("#description", Input).value.strip()
            due_date_str = self.query_one("#due_date", Input).value.strip()
            priority = self.query_one("#priority", Select).value
            category = self.query_one("#category", Input).value.strip() or None
            recurrence = self.query_one("#recurrence", Select).value

            # Parse due date if provided
            due_date = None
            if due_date_str:
                try:
                    from datetime import datetime
                    due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
                except ValueError:
                    # If date format is invalid, ignore it
                    due_date = None

            if not title:
                return

            self.dismiss({
                "title": title,
                "description": description,
                "due_date": due_date,
                "priority": priority,
                "category": category,
                "recurrence": recurrence
            })
        else:
            self.dismiss(None)

    def action_cancel(self) -> None:
        self.dismiss(None)


class EditTaskScreen(ModalScreen[dict]):
    """Modal screen for editing an existing task"""

    CSS = """
    EditTaskScreen {
        align: center middle;
    }

    #dialog {
        width: 60;
        height: auto;
        border: solid $accent;
        background: $surface;
        padding: 2;
    }

    .dialog-title {
        text-align: center;
        text-style: bold;
        color: $accent;
        padding-bottom: 1;
    }

    Input, Select {
        margin: 1 0;
    }

    Horizontal {
        align: center middle;
        height: auto;
    }

    Button {
        margin: 0 1;
    }
    """

    BINDINGS = [
        Binding("escape", "cancel", "Cancel"),
    ]

    def __init__(self, task: Task):
        super().__init__()
        self._todo_task = task

    def compose(self) -> ComposeResult:
        # Format due date for display
        due_date_str = self._todo_task.due_date.strftime("%Y-%m-%d") if self._todo_task.due_date else ""

        with Container(id="dialog"):
            yield Static("✏️ Edit Task", classes="dialog-title")
            yield Input(
                value=self._todo_task.title,
                placeholder="Task title",
                id="title"
            )
            yield Input(
                value=self._todo_task.description,
                placeholder="Description",
                id="description"
            )
            yield Input(
                value=due_date_str,
                placeholder="Due date (YYYY-MM-DD format, e.g. 2026-01-20, optional)",
                id="due_date"
            )
            yield Select(
                options=[
                    ("High Priority", Priority.HIGH),
                    ("Medium Priority", Priority.MEDIUM),
                    ("Low Priority", Priority.LOW),
                ],
                value=self._todo_task.priority,
                id="priority"
            )
            yield Input(
                value=self._todo_task.category or "",
                placeholder="Category",
                id="category"
            )
            yield Select(
                options=[
                    ("None", Recurrence.NONE),
                    ("Daily", Recurrence.DAILY),
                    ("Weekly", Recurrence.WEEKLY),
                    ("Monthly", Recurrence.MONTHLY),
                ],
                value=self._todo_task.recurrence,
                id="recurrence"
            )
            yield Horizontal(
                Button("Save", variant="primary", id="save"),
                Button("Cancel", variant="default", id="cancel")
            )

    def on_mount(self) -> None:
        self.query_one("#title", Input).focus()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "save":
            title = self.query_one("#title", Input).value.strip()
            description = self.query_one("#description", Input).value.strip()
            due_date_str = self.query_one("#due_date", Input).value.strip()
            priority = self.query_one("#priority", Select).value
            category = self.query_one("#category", Input).value.strip() or None
            recurrence = self.query_one("#recurrence", Select).value

            # Parse due date if provided
            due_date = None
            if due_date_str:
                try:
                    from datetime import datetime
                    due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
                except ValueError:
                    # If date format is invalid, ignore it
                    due_date = None

            if not title:
                return

            self.dismiss({
                "title": title,
                "description": description,
                "due_date": due_date,
                "priority": priority,
                "category": category,
                "recurrence": recurrence
            })
        else:
            self.dismiss(None)

    def action_cancel(self) -> None:
        self.dismiss(None)


class ConfirmDialog(ModalScreen[bool]):
    """Generic confirmation dialog"""

    CSS = """
    ConfirmDialog {
        align: center middle;
    }

    #dialog {
        width: 50;
        height: auto;
        border: solid $error;
        background: $surface;
        padding: 2;
    }

    .dialog-title {
        text-align: center;
        text-style: bold;
        color: $error;
        padding-bottom: 1;
    }

    .dialog-message {
        text-align: center;
        padding: 1 0;
    }

    Horizontal {
        align: center middle;
        height: auto;
    }

    Button {
        margin: 0 1;
    }
    """

    BINDINGS = [
        Binding("escape", "cancel", "Cancel"),
    ]

    def __init__(self, title: str, message: str):
        super().__init__()
        self.title_text = title
        self.message_text = message

    def compose(self) -> ComposeResult:
        with Container(id="dialog"):
            yield Static(self.title_text, classes="dialog-title")
            yield Static(self.message_text, classes="dialog-message")
            yield Horizontal(
                Button("Confirm", variant="error", id="confirm"),
                Button("Cancel", variant="default", id="cancel")
            )

    def on_button_pressed(self, event: Button.Pressed) -> None:
        self.dismiss(event.button.id == "confirm")

    def action_cancel(self) -> None:
        self.dismiss(False)


# ============================================================================
# Main Application
# ============================================================================

class TodoApp(App):
    """Modern Terminal Todo Application"""

    CSS = """
    Screen {
        background: $surface;
    }

    #banner {
        height: auto;
        background: $primary;
        color: $text;
        text-align: center;
        padding: 1;
        border: solid $accent;
    }

    #stats {
        height: 3;
        background: $panel;
        border: solid $secondary;
        padding: 1;
        text-align: center;
        color: $text;
    }

    #search-filter {
        height: 3;
        background: $panel;
        border: solid $accent;
        padding: 1;
        margin: 1 0;
    }

    Horizontal {
        height: auto;
    }

    DataTable {
        height: 1fr;
        border: solid $primary;
        margin: 1 0;
    }

    .completed {
        text-style: strike;
        color: $success;
    }

    .pending {
        color: $text;
    }

    .priority-high {
        color: red;
    }

    .priority-medium {
        color: yellow;
    }

    .priority-low {
        color: green;
    }
    """

    BINDINGS = [
        Binding("a", "add_task", "Add Task", show=True),
        Binding("e", "edit_task", "Edit", show=True),
        Binding("d", "delete_task", "Delete", show=True),
        Binding("space", "toggle_task", "Toggle", show=True),
        Binding("s", "set_search", "Search", show=True),
        Binding("f", "set_filter", "Filter", show=True),
        Binding("o", "set_sort", "Sort", show=True),
        Binding("c", "clear_filters", "Clear", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self):
        super().__init__()
        self.task_manager = TaskManager()
        self.search_keyword = ""
        self.filter_status = None
        self.filter_priority = None
        self.filter_category = None
        self.filter_due_date = None
        self.sort_by = "created_at"

    def compose(self) -> ComposeResult:
        # Create ASCII art banner
        banner_text = pyfiglet.figlet_format("Toony 2do", font="slant")
        yield Header(show_clock=True)
        yield Static(banner_text, id="banner")
        yield Static(id="stats")
        with Horizontal(id="search-filter"):
            yield Input(placeholder="Search (Press 's' to focus)", id="search")
            yield Select(
                options=[
                    ("All Status", None),
                    ("Pending", False),
                    ("Completed", True),
                ],
                value=None,
                id="filter-status"
            )
            yield Select(
                options=[
                    ("All Priority", None),
                    ("High", Priority.HIGH),
                    ("Medium", Priority.MEDIUM),
                    ("Low", Priority.LOW),
                ],
                value=None,
                id="filter-priority"
            )
            yield Select(
                options=[
                    ("Sort: Created", "created_at"),
                    ("Sort: Priority", "priority"),
                    ("Sort: Due Date", "due_date"),
                    ("Sort: Title", "title"),
                ],
                value="created_at",
                id="sort-by"
            )
        yield DataTable(zebra_stripes=True, cursor_type="row")
        yield Footer()

    def on_mount(self) -> None:
        """Initialize app"""
        table = self.query_one(DataTable)
        table.add_columns("ID", "Status", "Prio", "Category", "Title", "Description", "Due", "Recurrence")
        table.focus()
        self.refresh_ui()
        self._show_overdue_upcoming()

    def _show_overdue_upcoming(self) -> None:
        """Show overdue and upcoming tasks summary on launch"""
        result = self.task_manager.get_overdue_and_upcoming()
        if result["count"] > 0:
            overdue_count = len(result["overdue"])
            upcoming_count = len(result["upcoming"])
            message = f"⚠️ {overdue_count} overdue, {upcoming_count} due soon"
            self.notify(message, severity="warning")

    def refresh_ui(self) -> None:
        """Refresh entire UI"""
        self.refresh_table()
        self.refresh_stats()

    def refresh_table(self) -> None:
        """Update task table"""
        table = self.query_one(DataTable)
        table.clear()

        # Get filtered and sorted tasks
        tasks = self.task_manager.tasks.copy()

        # Apply filters
        tasks = self.task_manager.filter_tasks(
            status=self.filter_status,
            priority=self.filter_priority,
            category=self.filter_category,
            due_date_filter=self.filter_due_date
        )

        # Apply search
        if self.search_keyword:
            tasks = [
                t for t in tasks
                if self.search_keyword.lower() in t.title.lower() or
                   self.search_keyword.lower() in t.description.lower()
            ]

        # Apply sort
        tasks = self.task_manager.sort_tasks(tasks, self.sort_by)

        # Count and update display
        total_count = len(self.task_manager.tasks)
        shown_count = len(tasks)

        # Show empty state
        if not tasks:
            if self.search_keyword or any([
                self.filter_status is not None,
                self.filter_priority is not None,
                self.filter_category is not None,
                self.filter_due_date is not None
            ]):
                message = f"No tasks match criteria. Showing 0 of {total_count} tasks."
            else:
                message = "No tasks yet. Press 'a' to add your first task!"
            table.add_row("", message, "", "", "", "", "", "")
            return

        # Add tasks to table
        for task in tasks:
            status = "[x]" if task.completed else "[ ]"
            priority_icon = self._get_priority_icon(task.priority)
            category_text = task.category or "-"
            description_text = task.description[:50] + "..." if len(task.description) > 50 else task.description
            due_text = self._format_due_date(task.due_date)
            recurrence_icon = self._get_recurrence_icon(task.recurrence)

            table.add_row(
                str(task.id),
                status,
                priority_icon,
                category_text,
                task.title,
                description_text,
                due_text,
                recurrence_icon,
                key=str(task.id)
            )

        # Update filter info in table caption
        filter_parts = []
        if self.search_keyword:
            filter_parts.append(f"Search: '{self.search_keyword}'")
        if self.filter_status is not None:
            filter_parts.append(f"Status: {'Completed' if self.filter_status else 'Pending'}")
        if self.filter_priority is not None:
            filter_parts.append(f"Priority: {self.filter_priority.value}")
        if self.filter_category:
            filter_parts.append(f"Category: {self.filter_category}")
        if self.filter_due_date:
            filter_parts.append(f"Due: {self.filter_due_date}")

        if filter_parts:
            caption = " | ".join(filter_parts)
            table.caption = f"Showing {shown_count} of {total_count} tasks: {caption}"
        else:
            table.caption = f"Showing {shown_count} of {total_count} tasks"

    def refresh_stats(self) -> None:
        """Update statistics display"""
        stats = self.task_manager.get_stats()
        stats_widget = self.query_one("#stats", Static)

        stats_widget.update(
            f"Stats Total: {stats['total']} | "
            f"Pending: {stats['pending']} | "
            f"Completed: {stats['completed']} | "
            f"Progress: {stats['percentage']:.1f}%"
        )

    def _get_priority_icon(self, priority: Priority) -> str:
        """Get priority icon"""
        icons = {
            Priority.HIGH: "🔴",
            Priority.MEDIUM: "🟡",
            Priority.LOW: "🟢"
        }
        return icons.get(priority, "⚪")

    def _get_priority_style(self, priority: Priority) -> str:
        """Get priority color style"""
        styles = {
            Priority.HIGH: "red",
            Priority.MEDIUM: "yellow",
            Priority.LOW: "green"
        }
        return styles.get(priority, "white")

    def _get_recurrence_icon(self, recurrence: Recurrence) -> str:
        """Get recurrence icon"""
        icons = {
            Recurrence.DAILY: "🔄 Daily",
            Recurrence.WEEKLY: "🔄 Weekly",
            Recurrence.MONTHLY: "🔄 Monthly"
        }
        return icons.get(recurrence, "")

    def _format_due_date(self, due_date: datetime) -> str:
        """Format due date for display"""
        if not due_date:
            return "-"

        now = datetime.now()
        diff = due_date - now
        diff_hours = diff.total_seconds() / 3600

        if diff.total_seconds() < 0:
            return f"🔴 OVERDUE ({due_date.strftime('%b %d')})"
        elif diff_hours <= 24:
            return f"⚠️ {due_date.strftime('%b %d %H:%M')}"
        else:
            return due_date.strftime('%b %d')

    def action_add_task(self) -> None:
        """Add a new task"""
        def handle_result(result: dict | None) -> None:
            if result:
                try:
                    self.task_manager.add_task(
                        result["title"],
                        result["description"],
                        result["priority"],
                        result["category"],
                        result["due_date"],  # due_date from input
                        result["recurrence"]
                    )
                    self.refresh_ui()
                    self.notify("Task added successfully", severity="success")
                except ValueError as e:
                    self.notify(str(e), severity="error")

        self.push_screen(AddTaskScreen(), handle_result)

    def action_edit_task(self) -> None:
        """Edit selected task"""
        table = self.query_one(DataTable)
        if table.cursor_row is None:
            self.notify("No task selected", severity="warning")
            return

        row_data = table.get_row_at(table.cursor_row)
        row_key = row_data[0]
        task_id = int(row_key)

        # Find task from manager (not filtered list)
        task = self.task_manager.get_task(task_id)

        if not task:
            self.notify("Task not found", severity="error")
            return

        def handle_result(result: dict | None) -> None:
            if result:
                try:
                    self.task_manager.update_task(
                        task.id,
                        result["title"],
                        result["description"],
                        result["priority"],
                        result["category"],
                        result["due_date"],  # due_date from input
                        result["recurrence"]
                    )
                    self.refresh_ui()
                    self.notify("Task updated successfully", severity="success")
                except ValueError as e:
                    self.notify(str(e), severity="error")

        self.push_screen(EditTaskScreen(task), handle_result)

    def action_delete_task(self) -> None:
        """Delete selected task with confirmation"""
        table = self.query_one(DataTable)
        if table.cursor_row is None:
            self.notify("No task selected", severity="warning")
            return

        row_data = table.get_row_at(table.cursor_row)
        row_key = row_data[0]
        task_id = int(row_key)

        # Find task from manager
        task = self.task_manager.get_task(task_id)

        if not task:
            self.notify("Task not found", severity="error")
            return

        def handle_confirm(confirmed: bool) -> None:
            if confirmed:
                self.task_manager.delete_task(task.id)
                self.refresh_ui()
                self.notify("Task deleted successfully", severity="information")

        self.push_screen(
            ConfirmDialog(
                "Delete Task",
                f"Delete '{task.title}'?"
            ),
            handle_confirm
        )

    def action_toggle_task(self) -> None:
        """Toggle completion status of selected task"""
        table = self.query_one(DataTable)
        if table.cursor_row is None:
            self.notify("No task selected", severity="warning")
            return

        row_data = table.get_row_at(table.cursor_row)
        row_key = row_data[0]
        task_id = int(row_key)

        result = self.task_manager.toggle_task(task_id)
        if result:
            self.refresh_ui()
            # Check if new recurring task was created
            if result.id != task_id:
                self.notify("Task completed. Next instance created!", severity="success")
            else:
                status = "completed" if result.completed else "reopened"
                self.notify(f"Task {status}", severity="success")

    def action_set_search(self) -> None:
        """Focus search input"""
        self.query_one("#search", Input).focus()

    def action_set_filter(self) -> None:
        """Cycle filter options (simplified version)"""
        # For now, focus status filter
        self.query_one("#filter-status", Select).focus()

    def action_set_sort(self) -> None:
        """Cycle sort order"""
        sort_options = ["created_at", "priority", "due_date", "title"]
        current_idx = sort_options.index(self.sort_by) if self.sort_by in sort_options else 0
        self.sort_by = sort_options[(current_idx + 1) % len(sort_options)]

        sort_select = self.query_one("#sort-by", Select)
        sort_select.value = self.sort_by

        self.refresh_table()
        self.notify(f"Sorted by: {self.sort_by}", severity="information")

    def action_clear_filters(self) -> None:
        """Clear all filters and search"""
        self.search_keyword = ""
        self.filter_status = None
        self.filter_priority = None
        self.filter_category = None
        self.filter_due_date = None
        self.sort_by = "created_at"

        # Reset UI controls
        self.query_one("#search", Input).value = ""
        self.query_one("#filter-status", Select).value = None
        self.query_one("#filter-priority", Select).value = None
        self.query_one("#sort-by", Select).value = "created_at"

        self.refresh_ui()
        self.notify("Filters cleared", severity="information")

    def on_input_changed(self, event: Input.Changed) -> None:
        """Handle input changes for search"""
        if event.input.id == "search":
            self.search_keyword = event.value
            self.refresh_table()

    def on_select_changed(self, event: Select.Changed) -> None:
        """Handle select changes for filters and sort"""
        if event.select.id == "filter-status":
            self.filter_status = event.value
            self.refresh_table()
        elif event.select.id == "filter-priority":
            self.filter_priority = event.value
            self.refresh_table()
        elif event.select.id == "sort-by":
            self.sort_by = event.value
            self.refresh_table()


# ============================================================================
# Entry Point
# ============================================================================

def run() -> None:
    """Launch TUI application"""
    app = TodoApp()
    app.run()


if __name__ == "__main__":
    run()
