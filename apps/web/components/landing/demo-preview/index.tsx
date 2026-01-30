"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ListTodo, MessageCircle, Plus, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ChecklistCategory, ChecklistItem, Place, RouteSegment } from "./types";
import { DEMO_PLACES, DEMO_MESSAGES, ANIMATION_TIMING, DEMO_CHECKLIST } from "./data";
import {
  DEFAULT_CATEGORIES,
  EMOJI_OPTIONS,
  detectCategory,
  type CategoryConfig,
} from "./constants";
import { ChecklistSubHeader, SortableCategory } from "./checklist-components";
import { ChatSubHeader, BotMessage, UserMessage } from "./chat-components";
import { MapPanel } from "./map-components";

async function fetchWalkingRoute(from: Place, to: Place): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      return data.routes[0].geometry.coordinates as [number, number][];
    }
  } catch (error) {
    console.error("Failed to fetch walking route:", error);
  }
  return [[from.lng, from.lat], [to.lng, to.lat]];
}

export function DemoPreview() {
  // Chat state
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingId, setCurrentTypingId] = useState<number | null>(null);

  // Map state
  const [visiblePlaces, setVisiblePlaces] = useState<string[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState<"chat" | "checklist">("chat");

  // Checklist state
  const [categories, setCategories] = useState<CategoryConfig[]>(DEFAULT_CATEGORIES);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [visibleElements, setVisibleElements] = useState<string[]>([]);

  // Add item/category state
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<"item" | "category" | null>(null);

  // Track new items/categories for animations
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const [newCategoryIds, setNewCategoryIds] = useState<Set<string>>(new Set());

  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  const fetchedSegmentsRef = useRef<Set<string>>(new Set());
  const animationStartedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  // Progressive checklist animation
  useEffect(() => {
    if (activeTab === "checklist" && !animationStartedRef.current) {
      animationStartedRef.current = true;

      const showElements = async () => {
        setItems(DEMO_CHECKLIST.map(item => ({ ...item })));

        for (const category of DEFAULT_CATEGORIES) {
          await new Promise((r) => setTimeout(r, ANIMATION_TIMING.checklistItemDelay));
          setNewCategoryIds((prev) => new Set(prev).add(category.id));
          setVisibleElements((prev) => [...prev, `cat-${category.id}`]);
          // Clear new flag after animation
          setTimeout(() => {
            setNewCategoryIds((prev) => {
              const next = new Set(prev);
              next.delete(category.id);
              return next;
            });
          }, 300);

          const categoryItems = DEMO_CHECKLIST.filter(item => item.category === category.id);
          for (const item of categoryItems) {
            await new Promise((r) => setTimeout(r, ANIMATION_TIMING.checklistItemDelay / 2));
            setNewItemIds((prev) => new Set(prev).add(item.id));
            setVisibleElements((prev) => [...prev, item.id]);
            // Clear new flag after animation
            setTimeout(() => {
              setNewItemIds((prev) => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
              });
            }, 300);
          }
        }
      };
      showElements();
    }
  }, [activeTab]);

  // Chat sequence
  useEffect(() => {
    const runSequence = async () => {
      for (const message of DEMO_MESSAGES) {
        if (message.type === "bot") {
          setVisibleMessages((prev) => [...prev, message.id]);
          setIsTyping(true);
          setCurrentTypingId(message.id);

          await new Promise((r) => setTimeout(r, ANIMATION_TIMING.typingDuration));

          setIsTyping(false);
          setCurrentTypingId(null);

          if (message.mapAction?.type === "addPlace" && message.mapAction.placeId) {
            const placeIds = [message.mapAction.placeId];
            if (message.mapAction.alsoPush) placeIds.push(message.mapAction.alsoPush);

            for (const placeId of placeIds) {
              setVisiblePlaces((prev) => {
                if (prev.includes(placeId)) return prev;
                const newPlaces = [...prev, placeId];

                if (newPlaces.length >= 2) {
                  const fromId = newPlaces[newPlaces.length - 2];
                  const segmentKey = `${fromId}-${placeId}`;

                  if (!fetchedSegmentsRef.current.has(segmentKey)) {
                    fetchedSegmentsRef.current.add(segmentKey);
                    const fromPlace = DEMO_PLACES.find((p) => p.id === fromId);
                    const toPlace = DEMO_PLACES.find((p) => p.id === placeId);

                    if (fromPlace && toPlace) {
                      fetchWalkingRoute(fromPlace, toPlace).then((coords) => {
                        setRouteSegments((prev) => [...prev, { id: segmentKey, coords }]);
                      });
                    }
                  }
                }
                return newPlaces;
              });
              await new Promise((r) => setTimeout(r, ANIMATION_TIMING.placeAddDelay));
            }
          }
        } else {
          await new Promise((r) => setTimeout(r, ANIMATION_TIMING.userMessageDelay));
          setVisibleMessages((prev) => [...prev, message.id]);
        }

        const pauseDuration = message.type === "bot"
          ? ANIMATION_TIMING.botMessagePause
          : ANIMATION_TIMING.userMessagePause;
        await new Promise((r) => setTimeout(r, pauseDuration));
      }
    };

    const timer = setTimeout(runSequence, ANIMATION_TIMING.initialDelay);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setVisibleElements((prev) => prev.filter((id) => id !== itemId));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    const firstCategory = categories.find(c => c.id !== categoryId);
    if (firstCategory) {
      setItems((prev) => prev.map((item) =>
        item.category === categoryId ? { ...item, category: firstCategory.id } : item
      ));
    }
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const detectedCategory = detectCategory(newItemText.trim(), categories);
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: detectedCategory as ChecklistCategory,
      isAiGenerated: false,
    };
    setItems((prev) => [...prev, newItem]);
    setVisibleElements((prev) => [...prev, newItem.id]);
    setNewItemIds((prev) => new Set(prev).add(newItem.id));
    setNewItemText("");
    setIsAddingItem(false);
    // Clear new flag after animation
    setTimeout(() => {
      setNewItemIds((prev) => {
        const next = new Set(prev);
        next.delete(newItem.id);
        return next;
      });
    }, 300);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: CategoryConfig = {
      id: `custom-cat-${Date.now()}`,
      label: newCategoryName.trim(),
      emoji: newCategoryEmoji,
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCategory]);
    setVisibleElements((prev) => [...prev, `cat-${newCategory.id}`]);
    setNewCategoryIds((prev) => new Set(prev).add(newCategory.id));
    setNewCategoryName("");
    setNewCategoryEmoji("📦");
    setIsAddingCategory(false);
    setShowEmojiPicker(false);
    // Clear new flag after animation
    setTimeout(() => {
      setNewCategoryIds((prev) => {
        const next = new Set(prev);
        next.delete(newCategory.id);
        return next;
      });
    }, 300);
  };

  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) newSet.delete(categoryId);
      else newSet.add(categoryId);
      return newSet;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    setActiveDragType(id.startsWith("cat-") ? "category" : "item");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveDragType(null);

    if (!over) return;
    const activeIdStr = active.id as string;
    const overId = over.id as string;
    if (activeIdStr === overId) return;

    // Category reordering
    if (activeIdStr.startsWith("cat-") && overId.startsWith("cat-")) {
      const activeCatId = activeIdStr.replace("cat-", "");
      const overCatId = overId.replace("cat-", "");
      setCategories((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === activeCatId);
        const newIndex = prev.findIndex((c) => c.id === overCatId);
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Item operations
    if (!activeIdStr.startsWith("cat-")) {
      if (overId.startsWith("cat-") || overId.startsWith("drop-")) {
        const targetCategoryId = overId.replace("cat-", "").replace("drop-", "");
        setItems((prev) =>
          prev.map((item) =>
            item.id === activeIdStr ? { ...item, category: targetCategoryId as ChecklistCategory } : item
          )
        );
        return;
      }

      const activeItem = items.find((i) => i.id === activeIdStr);
      const overItem = items.find((i) => i.id === overId);

      if (activeItem && overItem) {
        setItems((prev) => {
          const oldIndex = prev.findIndex((i) => i.id === activeIdStr);
          const newIndex = prev.findIndex((i) => i.id === overId);

          if (activeItem.category !== overItem.category) {
            const updated = [...prev];
            updated[oldIndex] = { ...activeItem, category: overItem.category };
            return arrayMove(updated, oldIndex, newIndex);
          }
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }
  };

  const getDraggedElement = () => {
    if (!activeId) return null;
    if (activeDragType === "category") {
      return categories.find((c) => c.id === activeId.replace("cat-", ""));
    }
    return items.find((i) => i.id === activeId);
  };

  // Computed values
  const visiblePlaceData = DEMO_PLACES.filter((p) => visiblePlaces.includes(p.id));
  const draggedElement = getDraggedElement();
  const totalItems = items.length;
  const checkedCount = checkedItems.size;

  const visibleCategories = categories.filter((cat) => {
    const hasItems = items.some((item) => item.category === cat.id);
    const isVisible = visibleElements.includes(`cat-${cat.id}`);
    return hasItems || isVisible || cat.isCustom;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Chat + Checklist Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="lg:col-span-2"
      >
        <Card className="flex h-[500px] flex-col overflow-hidden border-2 bg-card shadow-2xl shadow-primary/10">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "chat" | "checklist")} className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="flex shrink-0 items-center justify-between border-b bg-muted/50 px-3 py-2">
              <TabsList className="h-9 bg-transparent p-0 gap-1">
                <TabsTrigger value="chat" className="h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
                  <MessageCircle className="size-3.5" />
                  <span className="text-xs font-medium">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="checklist" className="h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
                  <ListTodo className="size-3.5" />
                  <span className="text-xs font-medium">Checklist</span>
                  {totalItems > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {checkedCount}/{totalItems}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <Badge variant="outline" className="text-xs h-6">
                <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-green-500" />
                En ligne
              </Badge>
            </div>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
              <ChatSubHeader />
              <CardContent ref={chatRef} className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
                <AnimatePresence mode="popLayout">
                  {DEMO_MESSAGES.map((message) => {
                    if (!visibleMessages.includes(message.id)) return null;
                    const showTyping = isTyping && currentTypingId === message.id;
                    return message.type === "bot" ? (
                      <BotMessage key={message.id} text={message.text} showTyping={showTyping} />
                    ) : (
                      <UserMessage key={message.id} text={message.text} />
                    );
                  })}
                </AnimatePresence>
              </CardContent>
            </TabsContent>

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="flex-1 flex flex-col m-0 overflow-hidden">
              <ChecklistSubHeader itemCount={totalItems} checkedCount={checkedCount} />
              <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <SortableContext items={categories.map((c) => `cat-${c.id}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {visibleCategories.map((category) => {
                          const categoryItems = items.filter((item) => item.category === category.id);
                          const isVisible = visibleElements.includes(`cat-${category.id}`);
                          const isCollapsed = collapsedCategories.has(category.id);

                          if (categoryItems.length === 0 && !category.isCustom) return null;

                          return (
                            <SortableCategory
                              key={category.id}
                              category={category}
                              items={categoryItems}
                              checkedItems={checkedItems}
                              visibleElements={visibleElements}
                              isCollapsed={isCollapsed}
                              isVisible={isVisible}
                              isNew={newCategoryIds.has(category.id)}
                              newItemIds={newItemIds}
                              onToggle={handleCheckItem}
                              onDelete={handleDeleteItem}
                              onDeleteCategory={category.isCustom ? () => handleDeleteCategory(category.id) : undefined}
                              onToggleCollapse={() => toggleCategoryCollapse(category.id)}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {draggedElement ? (
                      activeDragType === "category" ? (
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-card border-2 border-primary shadow-xl cursor-grabbing">
                          <span className="text-sm">{(draggedElement as CategoryConfig).emoji}</span>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {(draggedElement as CategoryConfig).label}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border-2 border-primary shadow-xl cursor-grabbing">
                          <div className="size-4 rounded border flex items-center justify-center">
                            {checkedItems.has((draggedElement as ChecklistItem).id) && (
                              <div className="size-2 bg-primary rounded-sm" />
                            )}
                          </div>
                          <span className="text-sm">{(draggedElement as ChecklistItem).text}</span>
                          {(draggedElement as ChecklistItem).isAiGenerated && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1">
                              <Sparkles className="size-2.5" />
                              IA
                            </Badge>
                          )}
                        </div>
                      )
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>

              {/* Add item/category */}
              <div className="shrink-0 border-t p-3 space-y-2">
                <AnimatePresence mode="wait">
                  {isAddingItem ? (
                    <motion.div key="add-item" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddItem();
                          if (e.key === "Escape") { setIsAddingItem(false); setNewItemText(""); }
                        }}
                        placeholder="Ex: Ventoline, Passeport..."
                        className="flex-1 text-sm px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        autoFocus
                      />
                      <button onClick={handleAddItem} disabled={!newItemText.trim()} className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        OK
                      </button>
                      <button onClick={() => { setIsAddingItem(false); setNewItemText(""); }} className="px-2 py-2 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="size-4" />
                      </button>
                    </motion.div>
                  ) : isAddingCategory ? (
                    <motion.div key="add-category" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative">
                          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-3 py-2 text-lg border rounded-lg bg-background hover:bg-muted transition-colors">
                            {newCategoryEmoji}
                          </button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-card border rounded-lg shadow-lg z-10 grid grid-cols-6 gap-1 w-48">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button key={emoji} onClick={() => { setNewCategoryEmoji(emoji); setShowEmojiPicker(false); }} className="p-1.5 text-lg hover:bg-muted rounded transition-colors">
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddCategory();
                            if (e.key === "Escape") { setIsAddingCategory(false); setNewCategoryName(""); setShowEmojiPicker(false); }
                          }}
                          placeholder="Nom de la catégorie"
                          className="flex-1 text-sm px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          autoFocus
                        />
                        <button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          OK
                        </button>
                        <button onClick={() => { setIsAddingCategory(false); setNewCategoryName(""); setShowEmojiPicker(false); }} className="px-2 py-2 text-muted-foreground hover:text-foreground transition-colors">
                          <X className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                      <button onClick={() => setIsAddingItem(true)} className="flex-1 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 border border-dashed rounded-lg hover:border-primary/50">
                        <Plus className="size-3.5" />
                        Ajouter un élément
                      </button>
                      <button onClick={() => setIsAddingCategory(true)} className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 px-3 border border-dashed rounded-lg hover:border-primary/50">
                        <Plus className="size-3.5" />
                        Catégorie
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Map Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="lg:col-span-3"
      >
        <Card className="flex h-[500px] flex-col overflow-hidden border-2 bg-card shadow-2xl shadow-primary/10">
          <MapPanel places={visiblePlaceData} routeSegments={routeSegments} />
        </Card>
      </motion.div>
    </div>
  );
}
