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



export const updateLabelData = async (labelName, updatedData) => {
  const response = await fetch(`http://localhost:3001/api/update-label-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  const data = await response.json();
  return data;
};


export const getSignatureByKeyword = async (keyword) => {
  const response = await fetch(`http://localhost:3001/api/get-signature-by-keyword?keyword=${keyword}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};


//export const 