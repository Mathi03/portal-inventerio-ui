export function textOnly(valor: string) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  return regex.test(valor.trim());
}

export function numbersOnly(valor: string) {
  const regex = /^[0-9]+$/;
  return regex.test(valor.trim());
}
export function isValidCI(value: string): boolean {
  const ciRegex = /^\d{8}$/;
  return ciRegex.test(value);
}

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
};

export const formatRIF = (value: string): string => {
  const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  const letter = alphanumeric.charAt(0);
  const numbers = alphanumeric.slice(1, 9);
  const digit = alphanumeric.charAt(9);

  let result = '';
  if (letter) result += letter;
  if (numbers) result += `-${numbers}`;
  if (digit) result += `-${digit}`;

  return result;
};
