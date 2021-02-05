const express = require("express");
const captureRouter = express.Router();
const helper = require("./utils");
const { v4: uuidv4 } = require('uuid');

const randIndex = (arr) => {
  return Math.round(Math.random() * (arr.length));
};

const captureImages = [
  "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.15_a4e493c5-6716-4e82-8037-a8bd79f35a93_IMG_20180508_122718_1092514037.jpg",
  "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.19_e0cee0a8-c632-4c1a-9db6-b8e71825aacd_IMG_20180508_122732_518116791.jpg",
  "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.22_36c2e819-3361-4d0b-8ea6-74aa8fae7a5c_IMG_20180508_122747_682801763.jpg",
  "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.23_c4b23a45-9e3a-4279-9ad5-817cfa07dcae_IMG_20180508_122807_1448041764.jpg",
  "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.25_4adf0640-328b-4ef0-8264-26733b4f115e_IMG_20180508_122827_2146100199.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.20_21.43153005_76.85361942_67c98cfe-8490-4165-b697-f7738622282d_IMG_20201015_101931_8633736228593229413.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.17_21.43154296_76.85359282_a59292d8-b425-40c6-87a3-5999605d79d4_IMG_20201015_101837_5949827261295399927.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.10_21.43220491_76.85381342_adc0bded-6bdc-4f1f-a57d-7e6b330eb382_IMG_20201015_101516_5766514455848268637.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.52_21.43228539_76.85409731_a65a0811-cec3-4539-9aa3-5fcb27f77b66_IMG_20201015_112210_2245149088101935410.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.51_21.43226282_76.85418745_48a16307-4f0a-4cdc-b1f7-f53aeddc26b5_IMG_20201015_112045_4299523061237835279.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.44_21.43233026_76.85531259_abdd6521-b544-4af0-a06c-5313beb86392_IMG_20201015_105429_3760086495074290491.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.43_21.43225417_76.85546946_ddee504f-6cef-444f-a187-96f6967e3e1b_IMG_20201015_105205_5511111757020822913.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.41_21.43126802_76.85328189_888b239a-5b53-44d8-af51-65ee8e9824fe_IMG_20201015_103647_6415848748879876190.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.47_21.431945_76.85619672_11ed3698-b70b-4cd2-b459-cd5dd9686ec8_IMG_20201015_110540_5542981191488869292.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.20.07.43.23_21.437134999999998_82.86435000000002_59ea421f-063e-43d9-8e4b-31fcebacfe41_IMG_20201019_144011_6025525848621824013.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.20.07.43.28_21.43727333333333_82.86428_18c83909-a40e-4df5-936a-170c4d486a96_IMG_20201019_144034_6314138710575824733.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.10.14.37.58_21.44017666666667_82.86278166666668_1653785a-5db3-4a6c-a8c1-d24366677d38_IMG_20201010_143505_7681086758057577540.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.10.14.33.01_21.43923_82.85807333333332_912828d4-0880-4f1a-902e-bab4594b87f0_IMG_20201010_143111_944680059683990259.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.10.14.32.55_21.439301666666665_82.85806833333332_63c45071-b285-4bb0-b84b-510cfb5cfda1_IMG_20201010_143035_9052801007400166753.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.10.14.32.46_21.43921833333333_82.85849333333333_64061565-ceda-40c0-950e-ec874406258a_IMG_20201010_142541_3780495567059276675.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.31.16.24.32_25.305212647654116_79.31936256587505_a9701616-40ac-46cc-89a7-c4ec05b44dc5_IMG_20201031_111910_4929937072587559578.jpg",
]

const dates = [
  "2021-01-06 21:18:25", "2010-08-12 21:18:25", "2020-10-13 21:18:25", "2020-12-22 21:18:25", "2020-04-04 21:18:25","2021-11-16 21:18:25", "2010-09-26 21:18:25", "2020-07-30 21:18:25", "2020-03-27 21:18:25", "2020-06-02 21:18:25", "2021-02-18 21:18:25", "2010-06-14 21:18:25", "2020-11-03 21:18:25", "2020-05-09 21:18:25", "2020-09-01 21:18:25","2021-09-29 21:18:25", "2010-08-17 21:18:25", "2020-08-16 21:18:25", "2020-08-15 21:18:25", "2020-01-26 21:18:25"
]

const userImages = [
  "https://treetracker-production.nyc3.digitaloceanspaces.com/Planter%20Id%20=%201744.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.06.03.15.19.40_f908899d-21a0-49c9-89da-6b6383743eba_IMG_20200603_094615_1381783874.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.06.03.12.29.17_ed9cb12a-e79d-42a5-a938-8025d90c8b4b_IMG_20200603_105916_4475209214281402443.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.06.03.10.13.22_fab13a3d-2edf-4864-af33-f891ad874e36_IMG_20200603_083321_1584979280080607840.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.06.03.12.00.14_aa51eaa5-1de1-4ccb-9ebd-1456eafca407_IMG_20200603_103610_3156419657562304470.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/Planter%201856.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/Planter1837.jpg",
  //Tree images with people in, used as planters for sample data
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.48_21.43142947_76.85455327_05c2efdd-93d4-4b6f-9f15-c0fc772ab0da_IMG_20201015_111622_3951043965199807415.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.46_21.43200023_76.85613954_220066bb-e48d-4ef8-bb36-5155bc7a51d3_IMG_20201015_110505_3480860966873546925.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.45_21.43199638_76.85644338_4baf7bc9-45e6-41e4-bee2-14205bc482c3_IMG_20201015_110130_4419017238703850529.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.07.17.26.23_dfb7a7e0-c7b6-4079-8941-18394b2403d2_IMG_20190707_152537_9162789959739139131.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.07.17.27.31_0093318e-9ce9-4aab-b819-33df91d50831_IMG_20190707_154539_5214205709504534915.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.07.17.28.07_dd21f09b-ba31-4802-b5e5-9e491a5eb0c6_IMG_20190707_163115_2327427984185594902.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.05.21.09.33_1eb4ce35-e728-48cd-9edc-ca2672bbf060_IMG_20190705_185921_7044524914208076030.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.24.15.53.58_d58d5f25-5034-4088-8ce9-8f9fbbbe0154_IMG_20190724_122723_-780032207.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.07.17.26.23_dfb7a7e0-c7b6-4079-8941-18394b2403d2_IMG_20190707_152537_9162789959739139131.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.05.21.09.33_1eb4ce35-e728-48cd-9edc-ca2672bbf060_IMG_20190705_185921_7044524914208076030.jpg",
  "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.10.15.13.30.46_21.43200023_76.85613954_220066bb-e48d-4ef8-bb36-5155bc7a51d3_IMG_20201015_110505_3480860966873546925.jpg",
  "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.07.17.26.23_dfb7a7e0-c7b6-4079-8941-18394b2403d2_IMG_20190707_152537_9162789959739139131.jpg",
  "https://treetracker.org/static/media/greenstand_logo.c2a25f96.svg"
]

captureRouter.get("/", 
  helper.handlerWrapper(async (req, res) => {

    // mock: return a random array of capture objects
     
    let responseBody = {
      "captures": []
    }

    for (let step = 0; step < 20; step++) {
      responseBody.captures.push(
      {
        "captureId": uuidv4(step),
        "imageUrl": captureImages[randIndex(captureImages)],
        "userPhotoUrl": userImages[randIndex(userImages)],
        "createdAt": dates[randIndex(dates)],
        "latitude": 21.1,
        "longitude": 124.4,
        "tree_associated": false,
        "active": true,
        "verified": true
      }
      );
    }
    res.status(200).json(responseBody);
  })
);

captureRouter.get("/:capture/potential_trees", 
  helper.handlerWrapper(async (req, res) => {

    // mock: return a random array of capture objects
     
    let responseBody = {
      "trees": []
    }

    let captures = []
    for (let step = 0; step < 20; step++) {
      captures.push(
      {
        "captureId": uuidv4(step),
        "imageUrl": captureImages[randIndex(captureImages)],
        "userPhotoUrl": userImages[randIndex(userImages)],
        "createdAt": dates[randIndex(dates)],
        "latitude": 21.1,
        "longitude": 124.4,
        "tree_associated": false,
        "active": true,
        "verified": true
      }
      );
    }


    for (let step = 0; step < 20; step++) {
      responseBody.trees.push({
        tree_id: uuidv4(step),
        captures: captures
      })
    }


    res.status(200).json(responseBody);

  })
);



captureRouter.post('/:capture_id',
  helper.handlerWrapper(async (req, res) => {

    res.status(200);

  })
);

module.exports = captureRouter;
