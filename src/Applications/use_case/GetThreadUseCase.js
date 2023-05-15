class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const getComments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    thread.comments = getComments;
    return thread;
  }
}
module.exports = GetThreadUseCase;
