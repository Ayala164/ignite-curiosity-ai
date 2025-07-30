import { useState, useEffect } from 'react';
import { lessonAPI, childAPI, sessionAPI } from '../services/api';

// Custom hook for fetching lessons
export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await lessonAPI.getAll();
        setLessons(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error, refetch: () => fetchLessons() };
};

// Custom hook for fetching children
export const useChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await childAPI.getAll();
        setChildren(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  return { children, loading, error, refetch: () => fetchChildren() };
};

// Custom hook for fetching a single lesson
export const useLesson = (lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await lessonAPI.getById(lessonId);
        setLesson(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, loading, error };
};

// Custom hook for managing sessions
export const useSession = (sessionId) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await sessionAPI.getById(sessionId);
        setSession(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const addMessage = async (message) => {
    try {
      const response = await sessionAPI.addMessage(sessionId, message);
      setSession(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSession = async (updates) => {
    try {
      const response = await sessionAPI.update(sessionId, updates);
      setSession(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    session, 
    loading, 
    error, 
    addMessage, 
    updateSession,
    refetch: () => fetchSession()
  };
};