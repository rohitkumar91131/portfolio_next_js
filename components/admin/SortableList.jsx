"use client";

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-3 border-b border-gray-100 py-4 dark:border-gray-800 ${
        isDragging ? "relative z-10 bg-gray-50 opacity-90 dark:bg-gray-800/60" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab touch-none text-gray-300 transition-colors hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

// Accessible vertical drag-and-drop list. Only the handle initiates
// dragging, so buttons inside rows keep working normally.
export default function SortableList({ items, getId, onReorder, renderItem, footer }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <ul>
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
      {footer}
    </DndContext>
  );
}
