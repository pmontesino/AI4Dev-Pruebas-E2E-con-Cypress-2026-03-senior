import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

export const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Devuelve la ruta del archivo y el tipo
    } catch (error) {
        throw new Error('Error al subir el archivo:', error.response.data);
    }
};

export const sendCandidateData = async (candidateData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/candidates`, candidateData);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar datos del candidato:', error.response.data);
    }
};

export const getPositionInterviewFlow = async (positionId) => {
    const response = await axios.get(`${API_BASE_URL}/positions/${positionId}/interviewflow`);
    const payload = response.data.interviewFlow;

    return {
        positionName: payload.positionName,
        stages: payload.interviewFlow.interviewSteps
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((step) => ({
                id: step.id,
                title: step.name,
                orderIndex: step.orderIndex,
            })),
    };
};

export const getPositionCandidates = async (positionId) => {
    const response = await axios.get(`${API_BASE_URL}/positions/${positionId}/candidates`);

    return response.data.map((candidate) => ({
        id: candidate.candidateId,
        applicationId: candidate.applicationId,
        name: candidate.fullName,
        currentInterviewStepId: candidate.currentInterviewStepId,
        rating: candidate.averageScore,
        averageRating: candidate.averageScore,
    }));
};

export const updateCandidateStage = async ({ candidateId, applicationId, currentInterviewStep }) => {
    const response = await axios.put(`${API_BASE_URL}/candidates/${candidateId}`, {
        applicationId: Number(applicationId),
        currentInterviewStep: Number(currentInterviewStep),
    });

    return response.data;
};