export default function uniq(a) {
  const uniqueIds = [];

  const unique = a.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);

      return true;
    }

    return false;
  });
  return unique;
}
