export async function getProject(name: string): Promise<any> {
  // testing dummy
  if (name === 'contract-mesh/api') {
    return {
      contractmesh: 1.0,
      type: 'project',
      info: {
        name: 'contract-mesh/api'
      }
    };
  }

  return null;
}
