import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import CandidateCard from './CandidateCard';

const StageColumn = ({ stage, onCardClick }) => (
    <Col md={3}>
        <Droppable droppableId={`${stage.id}`}>
            {(provided) => (
                <Card
                    className="mb-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    data-testid={`phase-column-${stage.id}`}
                >
                    <Card.Header className="text-center" data-testid={`phase-title-${stage.id}`}>{stage.title}</Card.Header>
                    <Card.Body data-testid={`phase-dropzone-${stage.id}`}>
                        {stage.candidates.map((candidate, idx) => (
                            <CandidateCard key={candidate.id} candidate={candidate} index={idx} onClick={onCardClick} />
                        ))}
                        {stage.candidates.length === 0 && (
                            <div data-testid={`phase-empty-${stage.id}`}>
                                Sin candidatos en esta fase.
                            </div>
                        )}
                        {provided.placeholder}
                    </Card.Body>
                </Card>
            )}
        </Droppable>
    </Col>
);

export default StageColumn;
