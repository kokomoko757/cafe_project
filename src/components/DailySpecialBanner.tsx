import React, { useMemo } from 'react';
import { DAILY_RECOMMENDATIONS } from '../data/menu';

export const DailySpecialBanner: React.FC = () => {
  const drink = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_RECOMMENDATIONS.length);
    return DAILY_RECOMMENDATIONS[randomIndex];
  }, []);

  return (
    <div
      id="baristaRecommendationContainer"
      className="alert alert-light border shadow-sm p-3 rounded-3 mt-3 d-flex align-items-center gap-3"
    >
      <span className="fs-3" role="img" aria-label="Звезда">
        ⭐
      </span>
      <div>
        <strong className="d-block text-primary">Рекомендация бариста сегодня: {drink.name}</strong>
        <span className="small text-muted">{drink.note}</span>
      </div>
    </div>
  );
};
