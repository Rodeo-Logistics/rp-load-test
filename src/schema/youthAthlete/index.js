const {
  YouthManager,
  Contestant,
  Personal,
  EntryPool,
} = require('../../models');
const moment = require('moment-timezone');

const editYouthAthlete = (_, { input }, context) => {
  context.ability.throwUnlessCan('read', 'User');

  return YouthManager.upsertYouthAthlete(input);
};

const addYouthAthletes = async (_, { input }, context) => {
  context.ability.throwUnlessCan('read', 'User');

  const { userId, youthAthletes } = input;
  const success = await YouthManager.addYouthAthletes(
    userId,
    youthAthletes,
  ).then((res) => res && res.length);
  const error = !success && 'There was a problem adding your youth athletes.';
  return {
    success,
    error,
  };
};

const getYouthAthlete = (_, { id }, context) => {
  context.ability.throwUnlessCan('read', 'User');

  return YouthManager.getYouthAthlete(id);
};

const Query = {
  youthAthlete: getYouthAthlete,
};

const Mutation = {
  editYouthAthlete,
  addYouthAthletes,
};

const resolvers = {
  Query,
  Mutation,
  YouthAthlete: {
    id: (parent) => parent.ERAUID,
    firstName: (parent) => parent.FName,
    lastName: (parent) => parent.LName,
    Gender: (parent) => Personal.getGender(parent.ERAUID),
    user: (parent) => YouthManager.getYouthAthleteParent(parent.ERAUID),
    DOB: (parent) => parent.DOB && moment.utc(parent.DOB).format('YYYY-MM-DD'),
    disciplineId: ({ Disc }) => Disc,
    height: ({ Height }) => Height,
    weight: ({ Weight }) => Weight,
    facebook: ({ Facebook }) => Facebook,
    instagram: ({ Instagram }) => Instagram,
    twitter: ({ Twitter }) => Twitter,
    hometown: ({ Hometown }) => Hometown,
    nickname: ({ Nickname }) => Nickname,
    careerEarnings: ({ CareerEarnings }) => CareerEarnings,
    worldChampionshipEarned: ({ WorldChampionshipEarned }) =>
      WorldChampionshipEarned,
    photoFilename: ({ PhotoFilename }) => PhotoFilename,
    nominations: (parent) => Contestant.getNominations(parent.ERAUID),
    entryData: (parent) =>
      EntryPool.getAthleteEntryData({
        ERAUID: parent.ERAUID,
      }),
    phone: (parent) => YouthManager.getYouthAthleteParentPhone(parent.ERAUID),
    country: async ({ ERAUID }) => {
      const { Country } = await Personal.getAddress(ERAUID);
      return Country;
    },
    street: async ({ ERAUID }) => {
      const { Street } = await Personal.getAddress(ERAUID);
      return Street;
    },
    street2: async ({ ERAUID }) => {
      const { Street2 } = await Personal.getAddress(ERAUID);
      return Street2;
    },
    city: async ({ ERAUID }) => {
      const { City } = await Personal.getAddress(ERAUID);
      return City;
    },
    state: async ({ ERAUID }) => {
      const { State } = await Personal.getAddress(ERAUID);
      return State;
    },
    zip: async ({ ERAUID }) => {
      const { Zip } = await Personal.getAddress(ERAUID);
      return Zip;
    },
    isAthlete: () => true,
  },
};

module.exports = resolvers;
