const formatRupiah = (angka) => {
  if (angka === undefined) {
    return "Rp 0";
  }

  const numberString = angka.toString();
  const split = numberString.split(".");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  // Cek apakah ada koma atau tidak
  rupiah = split[1] !== undefined ? `${rupiah},${split[1]}` : rupiah;
  return `Rp ${rupiah}`;
};

export default formatRupiah;
