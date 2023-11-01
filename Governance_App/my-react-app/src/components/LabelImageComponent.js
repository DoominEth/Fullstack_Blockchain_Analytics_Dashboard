import GovernanceIcon from '../assets/Icons/GovernanceIcon.png';
import TokensIcon from '../assets/Icons/TokensIcon.png';
import veTokenIcon from '../assets/Icons/veTokenIcon.png';
import GaugeControllerIcon from '../assets/Icons/GaugeControllerIcon.png'
import EOAIcon from '../assets/Icons/EOAIcon.png'
import BurnIcon from '../assets/Icons/BurnIcon.png'
import TimelockIcon from '../assets/Icons/TimelockIcon.png'

const checkLabelForImage = (labels) => {

    if (!Array.isArray(labels) || labels.length === 0) {
        return null;
    }

    if (labels.includes('GovBravo')) {
        return GovernanceIcon;
    }

    if (labels.includes('ERC20')) {
        console.log("RETURNING TOKEN IMAGE")
        return TokensIcon;
    }

    if(labels.includes('veToken')){
        return veTokenIcon
    }
    if(labels.includes('GaugeController')){
        return GaugeControllerIcon
    }
    if(labels.includes('Timelock')){
        return TimelockIcon
    }
    if(labels.includes('EOA')){
        return EOAIcon
    }
    if(labels.includes('Burn')){
        return BurnIcon
    }

    return null;
};

export default checkLabelForImage;
