import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Button } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import StageColumn from './StageColumn';
import CandidateDetails from './CandidateDetails';
import { useNavigate } from 'react-router-dom';
import { getPositionInterviewFlow, getPositionCandidates, updateCandidateStage } from '../services/candidateService';

const PositionsDetails = () => {
    const { id } = useParams();
    const [stages, setStages] = useState([]);
    const [positionName, setPositionName] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [dragUpdateError, setDragUpdateError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadPositionPipeline = async () => {
            try {
                const [flowData, candidates] = await Promise.all([
                    getPositionInterviewFlow(id),
                    getPositionCandidates(id),
                ]);

                const stagesWithCandidates = flowData.stages.map((stage) => ({
                    ...stage,
                    candidates: candidates.filter((candidate) => candidate.currentInterviewStepId === stage.id),
                }));

                setStages(stagesWithCandidates);
                setPositionName(flowData.positionName);
            } catch (error) {
                console.error('Error loading position details:', error);
            }
        };

        loadPositionPipeline();
    }, [id]);

    const cloneStages = (stagesToClone) =>
        stagesToClone.map((stage) => ({
            ...stage,
            candidates: [...stage.candidates],
        }));

    const moveCandidateBetweenStages = (currentStages, source, destination) => {
        const nextStages = cloneStages(currentStages);
        const sourceStageIndex = nextStages.findIndex((stage) => String(stage.id) === source.droppableId);
        const destinationStageIndex = nextStages.findIndex((stage) => String(stage.id) === destination.droppableId);

        if (sourceStageIndex < 0 || destinationStageIndex < 0) {
            return null;
        }

        const sourceStage = nextStages[sourceStageIndex];
        const destinationStage = nextStages[destinationStageIndex];
        const [movedCandidate] = sourceStage.candidates.splice(source.index, 1);

        if (!movedCandidate) {
            return null;
        }

        destinationStage.candidates.splice(destination.index, 0, movedCandidate);

        return {
            nextStages,
            movedCandidate,
            destinationStageId: destinationStage.id,
        };
    };

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (
            source.droppableId === destination.droppableId
            && source.index === destination.index
        ) {
            return;
        }

        const previousStages = cloneStages(stages);
        const movementResult = moveCandidateBetweenStages(stages, source, destination);

        if (!movementResult) {
            return;
        }

        setDragUpdateError('');
        setStages(movementResult.nextStages);

        try {
            await updateCandidateStage({
                candidateId: movementResult.movedCandidate.id,
                applicationId: movementResult.movedCandidate.applicationId,
                currentInterviewStep: movementResult.destinationStageId,
            });
        } catch (error) {
            setStages(previousStages);
            setDragUpdateError('No se pudo actualizar la fase del candidato.');
            console.error('Error updating candidate step:', error);
        }
    };

    const handleCardClick = (candidate) => {
        setSelectedCandidate(candidate);
    };

    const closeSlide = () => {
        setSelectedCandidate(null);
    };

    return (
        <Container className="mt-5">
            <Button variant="link" onClick={() => navigate('/positions')} className="mb-3">
                Volver a Posiciones
            </Button>
            <h2 className="text-center mb-4" data-testid="position-title">{positionName}</h2>
            {dragUpdateError && (
                <div className="alert alert-danger" data-testid="drag-update-error">
                    {dragUpdateError}
                </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                    {stages.map((stage) => (
                        <StageColumn key={stage.id} stage={stage} onCardClick={handleCardClick} />
                    ))}
                </Row>
            </DragDropContext>
            <CandidateDetails candidate={selectedCandidate} onClose={closeSlide} />
        </Container>
    );
};

export default PositionsDetails;

