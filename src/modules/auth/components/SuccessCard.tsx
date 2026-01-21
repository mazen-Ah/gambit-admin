const SuccessCard = ({
  title,
  description,
  icon
}: { title: string, description: string, icon: JSX.Element }) => {
  return (
    <div className="success-card">
      <div className='success-icon'>
        {icon}
      </div>
      <div className="paragraph-button-container">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default SuccessCard;
