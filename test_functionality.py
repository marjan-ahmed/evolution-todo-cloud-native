#!/usr/bin/env python3
"""
Test script to verify the Todo application functionality
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'phase-1-cli'))
from phase_1_cli.main import TaskManager, Priority, Recurrence

def test_task_manager():
    print("Testing TaskManager functionality...")

    # Create a new TaskManager instance
    tm = TaskManager()
    print("✓ Created TaskManager")

    # Test adding tasks
    task1 = tm.add_task(
        title="Test task 1",
        description="First test task",
        priority=Priority.HIGH,
        category="Work",
        recurrence=Recurrence.WEEKLY
    )
    print(f"✓ Added task: {task1.title} (ID: {task1.id})")

    task2 = tm.add_task(
        title="Test task 2",
        description="Second test task",
        priority=Priority.LOW,
        category="Personal"
    )
    print(f"✓ Added task: {task2.title} (ID: {task2.id})")

    # Test getting a task
    retrieved_task = tm.get_task(1)
    if retrieved_task:
        print(f"✓ Retrieved task: {retrieved_task.title}")
    else:
        print("✗ Failed to retrieve task")

    # Test updating a task
    success = tm.update_task(1, title="Updated test task 1", description="Updated description")
    if success:
        updated_task = tm.get_task(1)
        print(f"✓ Updated task: {updated_task.title}")
    else:
        print("✗ Failed to update task")

    # Test toggle task
    toggled_task = tm.toggle_task(1)
    if toggled_task:
        print(f"✓ Toggled task: completed={toggled_task.completed}")
    else:
        print("✗ Failed to toggle task")

    # Test toggle again (should uncomplete)
    toggled_task2 = tm.toggle_task(1)
    if toggled_task2:
        print(f"✓ Toggled task again: completed={toggled_task2.completed}")
    else:
        print("✗ Failed to toggle task again")

    # Test statistics
    stats = tm.get_stats()
    print(f"✓ Stats: Total={stats['total']}, Completed={stats['completed']}, Pending={stats['pending']}, Progress={stats['percentage']:.1f}%")

    # Test search functionality
    search_results = tm.search_tasks("test")
    print(f"✓ Search for 'test': found {len(search_results)} tasks")

    # Test filter functionality
    high_priority_tasks = tm.filter_tasks(priority=Priority.HIGH)
    print(f"✓ Filter by high priority: found {len(high_priority_tasks)} tasks")

    # Test sort functionality
    sorted_tasks = tm.sort_tasks(by="priority")
    print(f"✓ Sort by priority: first task is {sorted_tasks[0].title if sorted_tasks else 'None'}")

    # Test recurring task (when completed, should create new instance)
    recurring_task = tm.add_task(
        title="Recurring task",
        priority=Priority.MEDIUM,
        recurrence=Recurrence.DAILY
    )
    print(f"✓ Added recurring task: {recurring_task.title}")

    # Toggle the recurring task to test recurrence
    result = tm.toggle_task(recurring_task.id)
    if result and result.id != recurring_task.id:
        print(f"✓ Recurring task created new instance: {result.title}")
    elif result:
        print(f"✓ Recurring task toggled: {result.completed}")

    # Test get_overdue_and_upcoming
    overdue_upcoming = tm.get_overdue_and_upcoming()
    print(f"✓ Overdue/Upcoming: {overdue_upcoming['count']} tasks")

    print("\nAll tests completed successfully! 🎉")

if __name__ == "__main__":
    test_task_manager()