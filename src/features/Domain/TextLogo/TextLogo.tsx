import { ScanIcon } from '../ScanIcon/ScanIcon';

const TextLogo = ({ withLogo = true }: { withLogo?: boolean }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div style={{ position: 'relative' }}>
        {withLogo && <ScanIcon />}
        <span
          className="title text-foreground"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
          Lisse
        </span>
      </div>
    </div>
  );
};

export default TextLogo;
