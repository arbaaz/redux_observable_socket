export default (state = {}, action) => {
  switch (action.type) {
    case "TICK":
      return action.payload;

    default:
      return state;
  }
};
