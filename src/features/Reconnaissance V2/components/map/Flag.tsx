interface Props {
  countryCode: string;
  width: number;
}

export default function Flag({ countryCode, width }: Props) {
  const getFlagUrl = (code: string, w: number = 64) => {
    const protocol = "https";
    const cdn = "flagcdn.com";
    const dimensions = `${w}x${w * 0.75}`;
    const country = code.toLowerCase();
    const ext = "png";
    return `${protocol}://${cdn}/${dimensions}/${country}.${ext}`;
  };

  return <img src={getFlagUrl(countryCode, width)} alt={countryCode} />;
}
