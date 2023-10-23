import GovernanceIcon from '../assets/Icons/GovernanceIcon.png';
import TokensIcon from '../assets/Icons/TokensIcon.png';

const checkLabelForImage = (labels) => {

    if (!Array.isArray(labels) || labels.length === 0) {
        return null;
    }

    if (labels.includes('GovBravo')) {
        return GovernanceIcon;
    }

    if (labels.includes('ERC20')) {
        return TokensIcon;
    }

    return null;
};

export default checkLabelForImage;
