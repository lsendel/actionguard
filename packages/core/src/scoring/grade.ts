import type { InspectionScore, LintFinding, ScoreGrade } from '../types.js';

export function calculateScore(findings: LintFinding[]): InspectionScore {
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  let basePoints = 100;

  for (const finding of findings) {
    if (finding.status === 'pass') {
      passCount++;
    } else if (finding.status === 'warn') {
      warnCount++;
      basePoints -= 8; // Warnings deduct 8 points
    } else if (finding.status === 'fail') {
      failCount++;
      basePoints -= 25; // Fails deduct 25 points
    }
  }

  const numericalScore = Math.max(0, Math.min(100, basePoints));

  let grade: ScoreGrade = 'F';
  if (failCount === 0 && warnCount === 0) {
    grade = 'A+';
  } else if (numericalScore >= 90 && failCount === 0) {
    grade = 'A';
  } else if (numericalScore >= 80) {
    grade = 'B';
  } else if (numericalScore >= 70) {
    grade = 'C';
  } else if (numericalScore >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  return {
    numericalScore,
    grade,
    passCount,
    warnCount,
    failCount,
  };
}
