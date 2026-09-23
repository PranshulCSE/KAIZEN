const { Server } = require('socket.io');
const aiService = require('./aiService.js');
const logger = require('../utils/logger.js');

function setupInterviewSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow connections from frontend dev & prod
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    logger.info(`Mock Interview Socket connected: ${socket.id}`);

    // Start a new mock interview session
    socket.on('start_interview', async (data) => {
      try {
        const { targetRole = 'Full Stack Software Engineer', resumeSummary = {}, candidateName = 'Candidate' } = data || {};

        // Generate opening icebreaker + technical intro question
        const firstQuestion = `Hi ${candidateName}! Welcome to your technical interview for the ${targetRole} position. To kick things off, could you give me a brief overview of your background, highlighting the key technologies you've worked with and a standout project you're most proud of?`;

        socket.emit('interview_started', {
          sessionId: socket.id,
          targetRole,
          firstQuestion,
          category: 'Introduction & Background',
          questionNumber: 1,
          totalQuestions: 5,
        });
      } catch (err) {
        logger.error('Socket start_interview error:', err);
        socket.emit('error', { message: 'Failed to initialize interview session.' });
      }
    });

    // Evaluate candidate's answer and supply the next question
    socket.on('submit_answer', async (data) => {
      try {
        const {
          history = [],
          currentAnswer,
          targetRole = 'Software Engineer',
          resumeSummary = {},
          questionNumber = 1,
          totalQuestions = 5,
        } = data || {};

        if (!currentAnswer || typeof currentAnswer !== 'string' || currentAnswer.trim().length < 5) {
          socket.emit('error', { message: 'Please provide a valid answer before submitting.' });
          return;
        }

        socket.emit('evaluating_answer', { isThinking: true });

        // Evaluate using Gemini AI
        const evaluation = await aiService.evaluateInterviewTurn(
          history,
          currentAnswer,
          targetRole,
          resumeSummary
        );

        const isLastQuestion = questionNumber >= totalQuestions;

        socket.emit('answer_evaluated', {
          questionNumber,
          score: evaluation.score,
          feedback: evaluation.feedback,
          starBreakdown: evaluation.starBreakdown,
          strengths: evaluation.strengths,
          improvementTips: evaluation.improvementTips,
          idealAnswer: evaluation.idealAnswer,
          nextQuestion: isLastQuestion ? null : evaluation.nextQuestion,
          questionCategory: evaluation.questionCategory,
          isInterviewComplete: isLastQuestion,
        });
      } catch (err) {
        logger.error('Socket submit_answer error:', err);
        socket.emit('error', { message: 'Failed to evaluate answer. Please try again.' });
      }
    });

    // Final assessment report
    socket.on('finish_interview', async (data) => {
      try {
        const { transcript = [], targetRole = 'Software Engineer' } = data || {};

        socket.emit('generating_summary', { isProcessing: true });

        const summary = await aiService.generateInterviewSummary(transcript, targetRole);

        socket.emit('interview_summary_ready', {
          summary,
        });
      } catch (err) {
        logger.error('Socket finish_interview error:', err);
        socket.emit('error', { message: 'Failed to generate interview scorecard.' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Mock Interview Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { setupInterviewSocket };
