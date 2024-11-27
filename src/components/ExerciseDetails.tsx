import { ExerciseTemplate } from '@/src/types/schema';

interface ExerciseDetailsProps {
  exercise: ExerciseTemplate;
}

export default function ExerciseDetails({ exercise }: ExerciseDetailsProps) {
  return (
    <div className="list-exercise-details">
      {/* Video Section */}
      {exercise.videoEmbed ? (
        <div className="video-section">
          <div className="video-embed" 
            dangerouslySetInnerHTML={{ __html: exercise.videoEmbed }} 
          />
        </div>
      ) : exercise.videoUrl && (
        <div className="video-section">
          <a href={exercise.videoUrl} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="video-link">
            Watch Demo Video
          </a>
        </div>
      )}

      {/* Description */}
      {exercise.description && (
        <p className="exercise-description">{exercise.description}</p>
      )}

      {/* Output Configuration */}
      <div className="output-config">
        <h4>Output Constants Configuration</h4>
        <div className="output-grid">
          <div className="config-item">
            <span className="config-label">Bodyweight Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.bodyweightFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Default Distance</span>
            <span className="config-value">
              {exercise.outputConstants?.defaultDistance 
                ? `${exercise.outputConstants.defaultDistance}m` 
                : 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Height Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.heightFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Arm Length Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.armLengthFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Leg Length Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.legLengthFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Calculation Method</span>
            <span className="config-value">
              {exercise.outputConstants?.useCalories === true
                ? 'Calories'
                : 'Force × Distance'}
            </span>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="classification-section">
        <div className="classification-group">
          <h5 className="subheader">Category</h5>
          <div className="tags-section">
            {exercise.category ? (
              <span className="tag category-tag">{exercise.category}</span>
            ) : (
              <span className="no-data">No category specified</span>
            )}
          </div>
        </div>

        <div className="classification-group">
          <h5 className="subheader">Equipment</h5>
          <div className="tags-section">
            {exercise.equipment && exercise.equipment.length > 0 ? (
              exercise.equipment.map((item, index) => (
                <span key={index} data-equipment={item.toLowerCase().replace(/\s+/g, '-')} className="tag equipment-tag">{item.replace(/\s+/g, '-')}</span>
              ))
            ) : (
              <span className="no-data">No equipment required</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
} 