"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RoomCard } from "@/components/public/RoomCard";
import { updateRoomOrder } from "@/lib/actions/rooms";
import type { RoomWithDetails } from "@/types/database";

function SortableItem({
  room,
  index,
}: {
  room: RoomWithDetails;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: room.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <RoomCard room={room} index={index} isAdmin />
    </div>
  );
}

export function RoomReorderList({
  initialRooms,
}: {
  initialRooms: RoomWithDetails[];
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rooms.findIndex((r) => r.id === active.id);
    const newIndex = rooms.findIndex((r) => r.id === over.id);
    const newOrder = arrayMove(rooms, oldIndex, newIndex);

    setRooms(newOrder);
    updateRoomOrder(newOrder.map((r) => r.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rooms.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <SortableItem key={room.id} room={room} index={i} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}