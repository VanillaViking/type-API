
export default function applyTestFilters(input) {
  const {
    discordIds,
    beforeDate,
    afterDate,
    sort,
    limit,
  } = input;

  const filters = {
    limit
  }

  if (discordIds) {
    filters = {
      ...filters,
      discordId: {
        $in: discordIds
      }
    }
  }

  //TODO: implement the other filters :skull:

return filters;
}
