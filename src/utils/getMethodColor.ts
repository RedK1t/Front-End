function getMethodColor(method: string) {
  return method === "GET"
    ? "bg-green-transparent text-green"
    : method === "POST"
      ? "bg-blue-transparent text-blue"
      : method === "PUT"
        ? "bg-orange-transparent text-yellow"
        : method === "DELETE"
          ? "bg-dark-red/10 text-light-red"
          : "";
}

export default getMethodColor;
