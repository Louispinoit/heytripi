"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { ChecklistItem } from "./types";
import type { CategoryConfig } from "./constants";

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }
  return true;
};

// Progress bar header
export function ChecklistSubHeader({ itemCount, checkedCount }: { itemCount: number; checkedCount: number }) {
  const progress = itemCount > 0 ? (checkedCount / itemCount) * 100 : 0;

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b bg-muted/30 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-xs font-medium">Généré par Tripy</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {checkedCount}/{itemCount} prêts
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Sortable category component
export function SortableCategory({
  category,
  items,
  checkedItems,
  visibleElements,
  isCollapsed,
  isVisible,
  isNew,
  newItemIds,
  onToggle,
  onDelete,
  onDeleteCategory,
  onToggleCollapse,
}: {
  category: CategoryConfig;
  items: ChecklistItem[];
  checkedItems: Set<string>;
  visibleElements: string[];
  isCollapsed: boolean;
  isVisible: boolean;
  isNew?: boolean;
  newItemIds?: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteCategory?: () => void;
  onToggleCollapse: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCategoryDragging,
  } = useSortable({
    id: `cat-${category.id}`,
    animateLayoutChanges,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `drop-${category.id}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isCategoryDragging ? "none" : "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isCategoryDragging ? 50 : undefined,
    opacity: isCategoryDragging ? 0.5 : 1,
  };

  if (!isVisible) return null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={isNew ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg"
    >
      {/* Category Header */}
      <div
        {...attributes}
        {...listeners}
        className="group flex items-center gap-2 py-1.5 cursor-grab active:cursor-grabbing touch-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        <span className="text-sm">{category.emoji}</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {category.label}
        </span>
        {items.length > 0 && (
          <span className="text-[10px] text-muted-foreground">({items.length})</span>
        )}
        {onDeleteCategory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCategory();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Items */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            ref={setDropRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 space-y-1 min-h-[8px]"
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const itemVisible = visibleElements.includes(item.id);
                  if (!itemVisible) return null;

                  return (
                    <SortableItem
                      key={item.id}
                      item={item}
                      isChecked={checkedItems.has(item.id)}
                      isNew={newItemIds?.has(item.id)}
                      onToggle={onToggle}
                      onDelete={onDelete}
                    />
                  );
                })}
              </AnimatePresence>
            </SortableContext>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Sortable item component
export function SortableItem({
  item,
  isChecked,
  isNew,
  onToggle,
  onDelete,
}: {
  item: ChecklistItem;
  isChecked: boolean;
  isNew?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: item.id,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={isNew ? { opacity: 0, x: -20, scale: 0.95 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...attributes}
      {...listeners}
      className={`group flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing touch-none ${
        isChecked ? "bg-primary/5" : ""
      } ${!isChecked && !isDragging ? "hover:bg-muted/50" : ""}`}
    >
      <div onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        <Checkbox
          id={item.id}
          checked={isChecked}
          onCheckedChange={() => onToggle(item.id)}
          className="size-4 cursor-pointer"
        />
      </div>
      <span
        className={`flex-1 text-sm select-none ${
          isChecked ? "line-through text-muted-foreground" : ""
        }`}
      >
        {item.text}
      </span>
      {item.isAiGenerated && (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1">
          <Sparkles className="size-2.5" />
          IA
        </Badge>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
        aria-label={`Supprimer ${item.text}`}
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
}
