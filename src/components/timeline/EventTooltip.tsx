import { Event } from '../../types/timeline';

export const createEventTooltip = (event: Event): string => {
  return `
    <div class="event-tooltip">
      <div class="flex justify-between items-start mb-4">
        <h3>${event.title}</h3>
        <div class="flex gap-2">
          <button class="tooltip-btn edit-btn" data-event-id="${event.id}" data-action="edit" aria-label="Edit event">
            <i class="icon-edit"></i>
          </button>
          <button class="tooltip-btn delete-btn" data-event-id="${event.id}" data-action="delete" aria-label="Delete event">
            <i class="icon-delete"></i>
          </button>
        </div>
      </div>
      <p>${event.description}</p>
      <div class="event-meta">
        <div>Start: ${event.startDate.toLocaleString()}</div>
        <div>End: ${event.endDate.toLocaleString()}</div>
      </div>
      <div class="event-tags">
        ${event.tags.map(tag => 
          `<span class="event-tag ${tag.color}">${tag.label}</span>`
        ).join('')}
      </div>
    </div>
  `;
};