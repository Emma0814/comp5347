var express = require('express');
var overall = require('../controllers/overall.server.controller');
var login = require('../controllers/user.controller');
var individual = require('../controllers/individual.server.controller');
var author = require('../controllers/author.server.controller');
var router = express.Router();


// user
router.get('/',login.signinJudgement);
router.get('/logout',login.logout);
router.get('/regist',login.regist);
router.post('/login',login.signinCheck);
router.post('/register',login.registCheck);

// overall
router.get('/getOverallHighAndLowArticle', overall.getOverallHighAndLowArticle);
router.get('/getOverallLargestRegistered', overall.getOverallLargestRegistered);
router.get('/getOverallLowestRegistered', overall.getOverallLowestRegistered);
router.get('/getOverallLongestHistory', overall.getOverallLongestHistory);
router.get('/getOverallShortestHistory', overall.getOverallShortestHistory);
router.get('/getOverallBar', overall.getOverallBar);
router.get('/getOverallPie', overall.getOverallPie);
router.get('/getOverallPieAdmin', overall.getOverallPieAdmin);

// individual
router.get('/getIndividual', individual.getIndividual)
router.get('/getIndividualMinimumYear', individual.getIndividualMinimumYear)
router.get('/getIndividualArticleLastRevisionDate', individual.getIndividualArticleLastRevisionDate)
router.get('/getUpdatedIndividualArticleHistory', individual.getUpdatedIndividualArticleHistory)
router.get('/getIndividualArticleRevisionInfo', individual.getIndividualArticleRevisionInfo)
router.get('/getIndividualArticleTopRegularUserInfo', individual.getIndividualArticleTopRegularUserInfo)
router.get('/getIndividualArticleTopUserInfo', individual.getIndividualArticleTopUserInfo)
router.get('/getIndividualChart1', individual.getIndividualChart1)
router.get('/getIndividualChart2', individual.getIndividualChart2)
router.get('/getIndividualChart3', individual.getIndividualChart3)

// author
router.get('/getAuthorName',author.getAuthorName)
router.get('/getChangedArticles',author.getChangedArticles)
router.get('/getChangedTimeStamp',author.getChangedTimeStamp)

module.exports = router;
