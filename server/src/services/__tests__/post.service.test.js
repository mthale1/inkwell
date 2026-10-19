import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
  searchPublished: jest.fn(),
};

const mockEventBus = {
  emit: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
    mockPostRepository.createWithTags.mockResolvedValue({
      id: "p1",
      title: "Hello",
      status: "PUBLISHED",
    });
  
    const post = await PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World",
    });
  
    expect(post.status).toBe("PUBLISHED");
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      "post.published",
      expect.objectContaining({ postId: "p1" })
    );
  });

  test("publish() rejects an empty title", async () => {
    await expect(
      PostService.publish({
        authorId: "u1",
        title: "",
        body: "World",
      })
    ).rejects.toThrow();
  });

  test("search() returns results for a query", async () => {
    const expected = {
      posts: [{ id: "p1", title: "Hello World" }],
      hasMore: false,
    };
  
    mockPostRepository.searchPublished.mockResolvedValue(expected);
  
    const result = await PostService.search({ query: "Hello" });
  
    expect(result).toEqual(expected);
    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "Hello",
      page: 1,
      pageSize: 10,
    });
  });

  test("search() returns an empty list when there are no matches", async () => {
    const expected = {
      posts: [],
      hasMore: false,
    };
  
    mockPostRepository.searchPublished.mockResolvedValue(expected);
  
    const result = await PostService.search({ query: "no-match" });
  
    expect(result).toEqual(expected);
    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "no-match",
      page: 1,
      pageSize: 10,
    });
  });

  test("search() forwards custom pagination and preserves hasMore", async () => {
    const expected = {
      posts: [{ id: "p2", title: "Hello again" }],
      hasMore: true,
    };
  
    mockPostRepository.searchPublished.mockResolvedValue(expected);
  
    const result = await PostService.search({
      query: "Hello",
      page: 2,
      pageSize: 5,
    });
  
    expect(result).toEqual(expected);
    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "Hello",
      page: 2,
      pageSize: 5,
    });
  });

  test("search() propagates a repository error", async () => {
    const error = new Error("Database unavailable");
  
    mockPostRepository.searchPublished.mockRejectedValue(error);
  
    await expect(
      PostService.search({ query: "Hello" })
    ).rejects.toBe(error);
  });
