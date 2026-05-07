import { useEffect, useState } from 'react';
import '../styles/SavingsProgressPanel.css';

function SavingsProgressPanel({ happySavings, becomeSavings, goalAmount, goalType }) {
  const totalSavings = happySavings + becomeSavings;
  const base = goalType === 'period' ? totalSavings : goalAmount;
  const targetHappy = base > 0 ? Math.min((happySavings / base) * 100, 100) : 0;
  const targetBecome = base > 0 ? Math.min((becomeSavings / base) * 100, 100) : 0;

  const [happyPercent, setHappyPercent] = useState(0);
  const [becomePercent, setBecomePercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHappyPercent(targetHappy);
      setBecomePercent(targetBecome);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetHappy, targetBecome]);

  return (
    <div className="savingsProgressPanel">
      <div className="savingsProgressPanel__card">
        <p className="savingsProgressPanel__label">행복저금</p>
        <p className="savingsProgressPanel__amount">{happySavings.toLocaleString('ko-KR')}원</p>
        <div className="savingsProgressPanel__barTrack">
          <div
            className="savingsProgressPanel__barFill savingsProgressPanel__barFill--happy"
            style={{ width: `${happyPercent}%` }}
          />
        </div>
      </div>

      <div className="savingsProgressPanel__card">
        <p className="savingsProgressPanel__label">행복해지는 저금</p>
        <p className="savingsProgressPanel__amount">{becomeSavings.toLocaleString('ko-KR')}원</p>
        <div className="savingsProgressPanel__barTrack">
          <div
            className="savingsProgressPanel__barFill savingsProgressPanel__barFill--become"
            style={{ width: `${becomePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default SavingsProgressPanel;
