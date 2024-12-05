import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import { useTimelineStore } from '../../store/timelineStore';
import { useTimelineData } from '../../hooks/useTimelineData';
import { TimelineLegend } from './TimelineLegend';
import { FilterPanel } from '../filters/FilterPanel';
import { EventDialog } from '../events/EventDialog';
import { createEventTooltip } from './EventTooltip';
import { TIMELINE_OPTIONS } from '../../constants/timeline';
import { createTimelineItems } from '../../utils/timelineData';
import { Event } from '../../types/timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export const TimelineView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const { testRuns, events, filters, updateFilters, updateEvent, deleteEvent } = useTimelineStore();
  const { filteredTestRuns, filteredEvents } = useTimelineData(testRuns, events, filters);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const createEventContent = (event: Event) => {
    return `
      <div class="event-item">
        <div class="event-title">${event.title}</div>
        <div class="event-tags">
          ${event.tags.map(tag => 
            `<span class="event-tag ${tag.color}">${tag.label}</span>`
          ).join('')}
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const timelineItems = [
      ...createTimelineItems(filteredTestRuns),
      ...filteredEvents.map(event => ({
        id: event.id,
        content: createEventContent(event),
        start: event.startDate,
        end: event.endDate,
        type: 'range',
        className: 'custom-event-range',
        title: createEventTooltip(event)
      }))
    ];

    const items = new DataSet(timelineItems);

    if (!timelineRef.current) {
      timelineRef.current = new Timeline(containerRef.current, items, {
        ...TIMELINE_OPTIONS,
        tooltip: {
          followMouse: false,
          overflowMethod: 'flip'
        }
      });

      containerRef.current.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const button = target.closest('.tooltip-btn');
        
        if (button) {
          const eventId = button.getAttribute('data-event-id');
          const action = button.getAttribute('data-action');
          
          if (eventId) {
            const event = events.find(e => e.id === eventId);
            if (event) {
              if (action === 'edit') {
                setSelectedEvent(event);
                setIsEditDialogOpen(true);
              } else if (action === 'delete') {
                if (window.confirm('Are you sure you want to delete this event?')) {
                  deleteEvent(eventId);
                }
              }
            }
          }
        }
      });
    } else {
      timelineRef.current.setItems(items);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [filteredTestRuns, filteredEvents, events, deleteEvent]);

  const handleUpdateEvent = (updatedEvent: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, updatedEvent);
      setSelectedEvent(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <TimelineLegend />
      <FilterPanel filters={filters} onFilterChange={updateFilters} />
      <div ref={containerRef} className="border rounded-lg shadow-sm min-h-[600px] mt-6"></div>

      <EventDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent || undefined}
      />
    </div>
  );
};