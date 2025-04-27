export const Env = (variableName) => {
  const value = process.env[variableName];
  if (value === undefined || value === null) {
    throw new Error(`${variableName} is not defined in the environment`);
  }
  return value;
};
