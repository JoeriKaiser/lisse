import { ScanIcon } from '../ScanIcon/ScanIcon';

const TextLogo = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div style={{ position: 'relative' }}>
        <ScanIcon />
        <span
          className="title"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
          Lisse
        </span>
      </div>
    </div>
  );
};

export default TextLogo;
