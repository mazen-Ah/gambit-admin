import { Switch } from '@mui/material';

const SwitchActivation = ({ loading, active, onChange }: any) => {
  return (
    <div className={`toggle ${active && 'checked'}`}>
      {loading ? <div className="loader"></div> : <Switch size="medium" checked={active} onChange={onChange} />}
    </div>
  );
};

export default SwitchActivation;
