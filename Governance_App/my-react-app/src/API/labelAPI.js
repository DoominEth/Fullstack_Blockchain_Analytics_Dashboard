export const buildEventLabelsFromGitHub = async (searchTerm, labelName) => {
  const response = await fetch('http://localhost:3001/api/build-event-labels-from-github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      searchTerm: searchTerm,
      labelName: labelName
    })
  });
  const data = await response.json();
  return data;
};


export const fetchUniqueLabelNames = async () => {
  const response = await fetch('http://localhost:3001/api/unique-label-names');
  const data = await response.json();
  return data.label_names;
};


export const getLabelInfoByName = async (labelName) => {
  const response = await fetch(`http://localhost:3001/api/get-label-info-by-name?labelName=${labelName}`);
  const data = await response.json();
  return data;
};
