import { QueryBuilder } from "../../utils/QueryBuilder";
import { walletSearchableFields } from "./wallet.constant";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

// const createWallet = async (payload: IWallet) => {
//   const wallet = await Wallet.create(payload);

//   return wallet;
// };

const getAllWallet = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Wallet.find(), query || {});
  const walletData = queryBuilder
    .search(walletSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    walletData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };

  // const wallet = await Wallet.find({});
  // const totalWallet = await Wallet.countDocuments();
  // return {
  //   data: wallet,
  //   meta: {
  //     total: totalWallet,
  //   },
  // };
};
const getSingleWallet = async (id: string) => {
  const wallet = await Wallet.findById({ _id: id });
  return {
    data: wallet,
  };
};
const updateWallet = async (id: string, payload: Partial<IWallet>) => {
  const existingWallet = await Wallet.findById(id);
  if (!existingWallet) {
    throw new Error("Division not found.");
  }
  const updatedWallet = await Wallet.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedWallet;
};
const deleteWallet = async (id: string) => {
  await Wallet.findByIdAndDelete(id);
  return null;
};

export const WalletService = {
  getAllWallet,
  getSingleWallet,
  updateWallet,
  deleteWallet,
};
