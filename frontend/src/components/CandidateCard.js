import React from 'react';
import { Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';

const CandidateCard = ({ candidate, index, onClick }) => (
    <Draggable key={candidate.id} draggableId={`candidate-${candidate.id}`} index={index}>
        {(provided) => (
            <Card
                className="mb-2"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => onClick(candidate)}
                data-testid={`candidate-card-${candidate.id}`}
                data-application-id={candidate.applicationId}
            >
                <Card.Body>
                    <Card.Title data-testid={`candidate-name-${candidate.id}`}>{candidate.name}</Card.Title>
                    <div>
                        {Array.from({ length: Math.max(0, Math.round(candidate.rating || 0)) }).map((_, i) => (
                            <span key={i} role="img" aria-label="rating">🟢</span>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        )}
    </Draggable>
);

export default CandidateCard;
