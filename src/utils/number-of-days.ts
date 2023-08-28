export function calculateNumberOfDays(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Nombre de millisecondes par jour
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Ajoutez 1 jour pour inclure à la fois startDate et endDate
  const numberOfDays = Math.round(
    (endTimestamp - startTimestamp) / millisecondsPerDay,
  );

  return numberOfDays;
}
