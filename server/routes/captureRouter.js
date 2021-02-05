const express = require("express");
const captureRouter = express.Router();
const helper = require("./utils");

captureRouter.get("/", 
  helper.handlerWrapper(async (req, res) => {

    // mock: return a random array of capture objects
     
    let responseBody = {
      "captures": []
    }

    const captureImages = [
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.15_a4e493c5-6716-4e82-8037-a8bd79f35a93_IMG_20180508_122718_1092514037.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.19_e0cee0a8-c632-4c1a-9db6-b8e71825aacd_IMG_20180508_122732_518116791.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.22_36c2e819-3361-4d0b-8ea6-74aa8fae7a5c_IMG_20180508_122747_682801763.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.23_c4b23a45-9e3a-4279-9ad5-817cfa07dcae_IMG_20180508_122807_1448041764.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.25_4adf0640-328b-4ef0-8264-26733b4f115e_IMG_20180508_122827_2146100199.jpg"
    ]

    const dates = ["2021-01-06 21:18:25", "2010-08-06 21:18:25", "2020-10-06 21:18:25", "2020-12-06 21:18:25", "2020-04-06 21:18:25"]

    for (let step = 0; step < 5; step++) {
      responseBody.captures.push(
      {
        "captureId": step.toString(),
        "imageUrl": captureImages[0],
        "userPhotoUrl": captureImages[0],
        "createdAt": dates[0],
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

    const captureImages = [
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.15_a4e493c5-6716-4e82-8037-a8bd79f35a93_IMG_20180508_122718_1092514037.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.19_e0cee0a8-c632-4c1a-9db6-b8e71825aacd_IMG_20180508_122732_518116791.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.22_36c2e819-3361-4d0b-8ea6-74aa8fae7a5c_IMG_20180508_122747_682801763.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.23_c4b23a45-9e3a-4279-9ad5-817cfa07dcae_IMG_20180508_122807_1448041764.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.05.09.11.04.25_4adf0640-328b-4ef0-8264-26733b4f115e_IMG_20180508_122827_2146100199.jpg"
    ]

    const dates = ["2021-01-06 21:18:25", "2010-08-06 21:18:25", "2020-10-06 21:18:25", "2020-12-06 21:18:25", "2020-04-06 21:18:25"]

    let captures = []
    for (let step = 0; step < 5; step++) {
      captures.push(
      {
        "captureId": step.toString(),
        "imageUrl": captureImages[0],
        "userPhotoUrl": captureImages[0],
        "createdAt": dates[0],
        "latitude": 21.1,
        "longitude": 124.4,
        "tree_associated": false,
        "active": true,
        "verified": true
      }
      );
    }


    for (let step = 0; step < 5; step++) {
      responseBody.trees.push({
        tree_id: step.toString(),
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
