export const formatDate = (date) => {
  if (!date || typeof date !== "string") return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}-${month}-${year}`;
};
