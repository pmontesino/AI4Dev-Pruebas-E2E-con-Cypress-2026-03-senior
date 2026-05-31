import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid candidate ID format', errorCode: 'INVALID_CANDIDATE_ID' });
        }
        const { applicationId, currentInterviewStep } = req.body;
        const applicationIdNumber = parseInt(applicationId);
        if (isNaN(applicationIdNumber)) {
            return res.status(400).json({ message: 'Invalid application ID format', errorCode: 'INVALID_APPLICATION_ID' });
        }
        const currentInterviewStepNumber = parseInt(currentInterviewStep);
        if (isNaN(currentInterviewStepNumber)) {
            return res.status(400).json({ message: 'Invalid currentInterviewStep format', errorCode: 'INVALID_INTERVIEW_STEP' });
        }
        const updatedCandidate = await updateCandidateStage(id, applicationIdNumber, currentInterviewStepNumber);
        res.status(200).json({ message: 'Candidate stage updated successfully', data: updatedCandidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === 'Application not found') {
                res.status(404).json({ message: 'Application not found', errorCode: 'APPLICATION_NOT_FOUND' });
            } else if (error.message === 'Invalid interview step for this position') {
                res.status(400).json({ message: 'Invalid interview step for this position', errorCode: 'INVALID_INTERVIEW_STEP_FOR_POSITION' });
            } else {
                res.status(400).json({ message: 'Error updating candidate stage', errorCode: 'UPDATE_CANDIDATE_STAGE_FAILED', error: error.message });
            }
        } else {
            res.status(500).json({ message: 'Error updating candidate stage', errorCode: 'UNKNOWN_ERROR' });
        }
    }
};
export { addCandidate };
