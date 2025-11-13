const axios = require('axios');

class N8NService {
  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL;
    this.apiKey = process.env.N8N_API_KEY;
  }

  /**
   * Sends audio conversation data to N8N workflow
   * @param {Object} conversationData - The conversation data to process
   * @returns {Promise<Object>} - N8N workflow response
   */
  async processConversation(conversationData) {
    try {
      const payload = {
        userId: conversationData.userId,
        audioData: conversationData.audioData,
        conversationId: conversationData.conversationId,
        timestamp: new Date().toISOString(),
        language: 'spanish',
        action: 'process_conversation'
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Spanish-IA-Tutor-Backend/1.0'
        },
        timeout: 30000 // 30 seconds timeout
      });

      return {
        success: true,
        data: response.data,
        executionId: response.data.executionId
      };
    } catch (error) {
      console.error('N8N Service Error:', error.message);
      
      if (error.response) {
        return {
          success: false,
          error: `N8N API Error: ${error.response.status} - ${error.response.statusText}`,
          details: error.response.data
        };
      }
      
      return {
        success: false,
        error: 'N8N Service Unavailable',
        details: error.message
      };
    }
  }

  /**
   * Starts a new conversation session with topic suggestions
   * @param {Object} sessionData - Session initialization data
   * @returns {Promise<Object>} - Topic suggestions and session info
   */
  async startConversationSession(sessionData) {
    try {
      const payload = {
        userId: sessionData.userId,
        userLevel: sessionData.level || 'intermediate',
        preferences: sessionData.preferences || [],
        action: 'start_session'
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 15000
      });

      return {
        success: true,
        topics: response.data.suggestedTopics || [],
        sessionId: response.data.sessionId,
        aiGreeting: response.data.greeting
      };
    } catch (error) {
      console.error('N8N Start Session Error:', error.message);
      return {
        success: false,
        error: 'Failed to start conversation session',
        details: error.message
      };
    }
  }

  /**
   * Gets conversation feedback from AI
   * @param {Object} feedbackData - Data for feedback generation
   * @returns {Promise<Object>} - AI feedback and suggestions
   */
  async getFeedback(feedbackData) {
    try {
      const payload = {
        conversationId: feedbackData.conversationId,
        transcript: feedbackData.transcript,
        duration: feedbackData.duration,
        action: 'generate_feedback'
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 20000
      });

      return {
        success: true,
        feedback: response.data.feedback,
        improvements: response.data.suggestions,
        score: response.data.score
      };
    } catch (error) {
      console.error('N8N Feedback Error:', error.message);
      return {
        success: false,
        error: 'Failed to generate feedback',
        details: error.message
      };
    }
  }

  /**
   * Checks N8N service health
   * @returns {Promise<Object>} - Health status
   */
  async healthCheck() {
    try {
      const response = await axios.get(this.webhookUrl.replace('/webhook/', '/health'), {
        timeout: 5000
      });
      
      return {
        success: true,
        status: 'healthy',
        response: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

module.exports = N8NService;