import { EventBus } from "../event-bus.js";

let totalPublished = 0;

EventBus.on("post.published", () => {
  totalPublished++;
});

export function getTotalPublished() {
  return totalPublished;
}