type PropType = {
  title: string;
};

function ChartTitle(props: PropType) {
  return (
    <div className="chat-title pb-3 text-lg">
      <div className="info">{props.title}</div>
    </div>
  );
}

export default ChartTitle;
