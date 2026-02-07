# Deployment Guide

This document describes the exact, repeatable steps to publish the current draft build to the live production site on the Internet Computer.

## Overview

The application runs on the Internet Computer (ICP) blockchain. This deployment process publishes the current draft build to production **without making any code changes**. The live site will serve the same behavior and content as the current draft build.

## Prerequisites

- DFX CLI installed and configured (version 0.15.0 or later)
- Internet Computer wallet with sufficient cycles
- Admin access to the production canister
- Node.js (v18+) and pnpm installed
- Current draft build tested and verified

## Production Deployment Steps

### 1. Verify Draft Build

Before deploying to production, confirm the draft build version and commit:

