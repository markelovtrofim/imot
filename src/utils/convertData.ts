export const convertDate = (date: string | null, to: 'display' | 'request') => {
  // data request format month/day/year "2/24/2022".
  if (date) {
    const dateArray = date.split("/");
    if (dateArray[0].length === 1) {
      dateArray[0] = `0${dateArray[0]}`;
    }
    if (dateArray[1].length === 1) {
      dateArray[1] = `0${dateArray[1]}`;
    }
    if (to === 'display') { return `${dateArray[1]}.${dateArray[0]}.${dateArray[2]}` }
    else if (to === 'request') { return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}` }
  }
  else { return date }
};
