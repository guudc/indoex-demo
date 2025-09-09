import React, { Suspense, lazy } from 'react'
import { Route, Switch, useLocation, HashRouter } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

const Home = lazy(() => import('./Home'))
const Stake = lazy(() => import('./Stake'))
const Limit = lazy(() => import('./Limit'))
const Airdrop = lazy(() => import('./Airdrop'))
const MyAirdrops = lazy(() => import('./Airdrop/myAirdrops'))
const UpdateAirdrop = lazy(() => import('./Airdrop/editAirdrop'))
const Details = lazy(() => import('./Airdrop/Details'))
const Vote = lazy(() => import('./Vote'))
const Voting = lazy(() => import('./Voting'))
const Proposal = lazy(() => import('./Proposal'))
const Stakeview = lazy(() => import('./Stake/inner'))
const Register = lazy(() => import('./Airdrop/register'))
const RegisterSuccess = lazy(() => import('./Airdrop/register-success'))
const Dashboard = lazy(() => import('./Airdrop/dashboard'))
const SubmitAirdrop = lazy(() => import('./Airdrop/submitAirdrop'))
const AdminDashboard = lazy(() => import('./Admin/dashboard'))
const AdminUsers = lazy(() => import('./Admin/users'))
const AdminAirdrops = lazy(() => import('./Admin/airdrops'))
const ActivateAccount = lazy(() => import('./Airdrop/activate-account'))
const Login = lazy(() => import('./Airdrop/login'))
const VerifyEmail = lazy(() => import('./Airdrop/verify-email'))
const ChangePassword = lazy(() => import('./Airdrop/changePassword'))
const ResetPassword = lazy(() => import('./Airdrop/resetPassword'))


const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  z-index: 4;
  height: 86px;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 172px);
  width: 100%;
  padding-top: 60px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const Footer = styled.div`
  font-size: 12px;
  text-align: center;
  width: 420px;
  margin: auto;
  color: #fffa;
`

export default function App() {
  const location = useLocation()

  return (
    <Suspense fallback={null}>
      {location.pathname !== '/' ? (
        <HashRouter>
          <Route component={DarkModeQueryParamReader} />
          <AppWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact strict path="/vote" component={Vote} />
                  <Route exact strict path="/voting" component={Voting} />
                  <Route exact strict path="/proposal" component={Proposal} />
                  <Route exact strict path="/stake" component={Stake} />
                  <Route exact strict path="/stakeview" component={Stakeview} />
                  <Route exact strict path="/limit" component={Limit} />
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route strict exact path="/airdrop" component={Airdrop} />
                  <Route strict exact path="/my-airdrops" component={MyAirdrops} />
                  <Route strict exact path="/update/airdrop/:name" component={UpdateAirdrop} />
                  <Route strict exact path="/register" component={Register} />
                  <Route strict exact path="/register-success" component={RegisterSuccess} />
                  <Route strict exact path="/activate/:token" component={ActivateAccount} />
                  <Route strict exact path="/login" component={Login} />
                  <Route strict exact path="/verify-email" component={VerifyEmail} />
                  <Route strict exact path="/dashboard" component={Dashboard} />
                  <Route strict exact path="/submit-airdrop" component={SubmitAirdrop} />
                  <Route strict exact path="/admin/dashboard" component={AdminDashboard} />
                  <Route strict exact path="/admin/users" component={AdminUsers} />
                  <Route strict exact path="/admin/airdrops" component={AdminAirdrops} />
                  <Route strict exact path="/airdrop/:name" component={Details} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact strict path="/change/password" component={ChangePassword} />
                  <Route exact strict path="/reset/password/:code" component={ResetPassword} />
                  <Route exact strict path="/create" component={AddLiquidity} />
                  <Route exact path="/add" component={AddLiquidity} />
                  {/* <Route exact strict path="/governance" component={GovPages} /> */}
                  {/* <Route exact strict path="/governance/:asset/pairs" component={GovPages} /> */}
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  {/* <Route component={RedirectPathToSwapOnly} /> */}
                </Switch>
              </Web3ReactManager>
              <Marginer />
            </BodyWrapper>

            <Footer>{new Date().getFullYear()} &copy; INDOEX</Footer>
          </AppWrapper>
        </HashRouter>
      ) : (
        <Switch>
          <Route exact strict path="/" component={Home} />
          <Route exact strict path="/airdrop" component={Airdrop} />
          <Route strict exact path="/airdrop/:name" component={Details} />
        </Switch>
      )}
    </Suspense>
  )
}

